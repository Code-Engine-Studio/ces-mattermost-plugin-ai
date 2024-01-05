/* eslint-disable import/no-unresolved */
import { connect } from 'react-redux';

import { getPluginChannelId } from '../../selectors';

import RHSView from './rhs_view';

export type stateProps = {
  pluginChannelId: string;
  entities: {
    users: {
      currentUserId: string,
      profiles: {
        [key: string]: {
          roles: string
        }
      };
    };
    channels: {
      currentChannelId: string,
    };

  };
}

const mapStateToProps = (state: stateProps) => ({
  entities: state.entities,
  pluginChannelId: getPluginChannelId(state),
});

export default connect(mapStateToProps)(RHSView);
