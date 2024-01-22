import React, {useEffect} from 'react';
import {connect} from 'react-redux';

import {getPluginChannelId} from '../../selectors';

const Hooks = (props) => {
    // eslint-disable-next-line react/prop-types
    const {entities: {channels: {currentChannelId}}, pluginChannelId, onSelectPluginChannelHandler, onLeavePluginChannelHandler} = props;
    useEffect(() => {
        if (currentChannelId !== pluginChannelId) {
            return onLeavePluginChannelHandler();
        }
        return onSelectPluginChannelHandler();
    }, [currentChannelId, pluginChannelId]);

    return (
        <></>
    );
};

const mapStateToProps = (state: any) => ({pluginChannelId: getPluginChannelId(state), entities: state.entities});

export default connect(mapStateToProps)(Hooks);