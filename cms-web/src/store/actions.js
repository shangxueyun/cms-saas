const action = {
  projectManagementsAction (context, data) {
    context.commit('projectManagementsMutation', data)
  },
  staffInfoAction (context, data) {
    context.commit('staffInfoMutation', data)
  },
  usersAction (context, data) {
    context.commit('usersMutation', data)
  },
  industryAction (context, data) {
    context.commit('industryMutation', data)
  },
  projectAction (context, data) {
    context.commit('projectMutation', data)
  }
}
export default action
