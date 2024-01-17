import React, {useEffect} from 'react';
import {connect} from 'react-redux';

import {getPluginChannelId} from '../../selectors';

import IconAI from '../assets/icon_ai';

const Hooks = (props) => {
    // eslint-disable-next-line react/prop-types
    const {entities: {channels: {currentChannelId}}, pluginChannelId, onSelectPluginChannelHandler, onLeavePluginChannelHandler} = props;
    useEffect(() => {
        if (currentChannelId !== pluginChannelId) {
            return onLeavePluginChannelHandler();
        }
        return onSelectPluginChannelHandler();
    }, [currentChannelId, pluginChannelId]);
    const iconStyle = {
        display: 'inline-block',
        margin: '0 7px 0 1px',
    };
    const style = {
        padding: '0 12px 0 15px',
        color: 'rgba(255,255,255,0.6)',
    };

    return (
        <></>
    );
};

const mapStateToProps = (state: any) => ({pluginChannelId: getPluginChannelId(state), entities: state.entities});

export default connect(mapStateToProps)(Hooks);