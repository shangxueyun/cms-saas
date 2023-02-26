const Mutation = {
  projectManagementsMutation (state, data) {
    state.projectManagementsList = data
  },
  staffInfoMutation (state, data) {
    state.staffInfo = data
  },
  usersMutation (state, data) {
    state.usersList = data
  },
  industryMutation (state, data) {
    state.industryList = data
  },
  projectMutation (state, data) {
    state.projectList = data
  },
  setwareHouseData (state, data) {
    state.wareHouseData = data
  }
}
export default Mutation
