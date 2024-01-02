import {connect} from 'react-redux';

import RHSView from './rhs_view';

const mapStateToProps = (state: any) => state;

export default connect(mapStateToProps)(RHSView);
