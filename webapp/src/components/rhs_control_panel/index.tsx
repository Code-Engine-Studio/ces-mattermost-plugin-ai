import { connect } from "react-redux";

import RHSView from "./rhs_view";

const mapStateToProps = (state: any) => ({
  entities: state.entities,
});

export default connect(mapStateToProps)(RHSView);
