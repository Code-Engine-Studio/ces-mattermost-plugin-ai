package main

import (
	"fmt"
	"strings"
	"time"

	"github.com/mattermost/mattermost/server/public/model"
	"github.com/mattermost/mattermost/server/public/plugin"
	"github.com/pkg/errors"
)

const (
	commandTriggerMentions = "mai"
)

func (p *Plugin) registerCommands() error {
	if err := p.API.RegisterCommand(&model.Command{
		Trigger:          commandTriggerMentions,
		AutoComplete:     true,
		AutoCompleteHint: "",
		AutoCompleteDesc: "Show example questions to ask MAI",
	}); err != nil {
		return errors.Wrapf(err, "failed to register %s command", commandTriggerMentions)
	}

	return nil
}

func (p *Plugin) ExecuteCommand(c *plugin.Context, args *model.CommandArgs) (*model.CommandResponse, *model.AppError) {
	delay := p.getConfiguration().IntegrationRequestDelay
	if delay > 0 {
		time.Sleep(time.Duration(delay) * time.Second)
	}

	trigger := strings.TrimPrefix(strings.Fields(args.Command)[0], "/")
	switch trigger {
	case commandTriggerMentions:
		return p.executeCommandMentions(args), nil
	default:
		return &model.CommandResponse{
			ResponseType: model.CommandResponseTypeEphemeral,
			Text:         fmt.Sprintf("Unknown command: " + args.Command),
		}, nil
	}
}

func (p *Plugin) executeCommandMentions(args *model.CommandArgs) *model.CommandResponse {
	message := "The command `" + args.Command + "` contains the following different mentions.\n"
	message += "### Mentions to users in the team\n"
	if args.UserMentions == nil {
		message += "_There are no mentions to users in the team in your command_.\n"
	} else {
		message += "| User name | ID |\n"
		message += "|-----------|----|\n"
		for name, id := range args.UserMentions {
			message += fmt.Sprintf("|@%s|%s|\n", name, id)
		}
	}

	message += "\n### Mentions to public channels\n"
	if args.ChannelMentions == nil {
		message += "_There are no mentions to public channels in your command_.\n"
	} else {
		message += "| Channel name | ID |\n"
		message += "|--------------|----|\n"
		for name, id := range args.ChannelMentions {
			message += fmt.Sprintf("|~%s|%s|\n", name, id)
		}
	}

	post := &model.Post{
		ChannelId: args.ChannelId,
		RootId:    args.RootId,
		UserId:    p.botid,
		Message:   message,
	}

	_, err := p.API.CreatePost(post)
	if err != nil {
		const errorMessage = "Failed to create post"
		p.API.LogError(errorMessage, "err", err.Error())
		return &model.CommandResponse{
			ResponseType: model.CommandResponseTypeEphemeral,
			Text:         errorMessage,
		}
	}

	return &model.CommandResponse{}
}
