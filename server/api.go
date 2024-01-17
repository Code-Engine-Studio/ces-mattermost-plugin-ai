package main

import (
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/mattermost/mattermost/server/public/model"
	"github.com/mattermost/mattermost/server/public/plugin"
	"github.com/pkg/errors"
)

const (
	ContextPostKey    = "post"
	ContextChannelKey = "channel"
	MaiNodeEndpoint   = "http://ces-mai:8080"
)

// ServeHTTP demonstrates a plugin that handles HTTP requests by greeting the world.
func (p *Plugin) ServeHTTP(c *plugin.Context, w http.ResponseWriter, r *http.Request) {
	router := gin.Default()
	router.Use(p.ginlogger)
	router.Use(p.MattermostAuthorizationRequired)

	router.GET("/ai_threads", p.handleGetAIThreads)

	postRouter := router.Group("/post/:postid")
	postRouter.Use(p.postAuthorizationRequired)
	postRouter.POST("/react", p.handleReact)
	postRouter.POST("/summarize", p.handleSummarize)
	postRouter.POST("/transcribe", p.handleTranscribe)
	postRouter.POST("/stop", p.handleStop)
	postRouter.POST("/regenerate", p.handleRegenerate)

	maiRouter := router.Group("/mai")
	maiRouter.GET("/questions", p.handleGetMAIQuestions)

	channelRouter := router.Group("/channel/:channelid")
	channelRouter.Use(p.channelAuthorizationRequired)
	channelRouter.POST("/since", p.handleSince)

	adminRouter := router.Group("/admin")
	adminRouter.Use(p.mattermostAdminAuthorizationRequired)

	router.ServeHTTP(w, r)
}

func (p *Plugin) ginlogger(c *gin.Context) {
	c.Next()

	for _, ginErr := range c.Errors {
		p.API.LogError(ginErr.Error())
	}
}

func (p *Plugin) MattermostAuthorizationRequired(c *gin.Context) {
	userID := c.GetHeader("Mattermost-User-Id")
	if userID == "" {
		c.AbortWithStatus(http.StatusUnauthorized)
		return
	}
}

func (p *Plugin) handleGetAIThreads(c *gin.Context) {
	userID := c.GetHeader("Mattermost-User-Id")

	botDMChannel, err := p.pluginAPI.Channel.GetDirect(userID, p.botid)
	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, errors.Wrap(err, "unable to get DM with AI bot"))
		return
	}

	// Extra permissions checks are not totally nessiary since a user should always have permission to read their own DMs
	if !p.pluginAPI.User.HasPermissionToChannel(userID, botDMChannel.Id, model.PermissionReadChannel) {
		c.AbortWithError(http.StatusForbidden, errors.New("user doesn't have permission to read channel"))
		return
	}

	posts, err := p.getAIThreads(botDMChannel.Id)
	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, errors.Wrap(err, "failed to get posts for bot DM"))
		return
	}

	c.JSON(http.StatusOK, posts)
}

func (p *Plugin) handleGetMAIQuestions(c *gin.Context) {
	response, err := http.Get(MaiNodeEndpoint + "/example-questions")
	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, errors.Wrap(err, "failed to get example questions"))
		return
	}
	responseData, err := ioutil.ReadAll(response.Body)

	data := string(responseData)
	fmt.Printf("response: %+v\n", string(responseData))
	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, errors.Wrap(err, "invalid response from mai server"))
		return
	}

	c.JSON(http.StatusOK, data)
}
