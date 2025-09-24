const localStoragePlugin = store => {
  store.subscribe((mutation, { common }) => {
    if (mutation.type == 'common/changeTheme') {
      window.localStorage.setItem('theme', common.theme)
    }
  })
}

export default localStoragePlugin
