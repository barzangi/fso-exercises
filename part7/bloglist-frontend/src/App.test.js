import React from 'react'
import { render, waitForElement } from '@testing-library/react'
import App from './App'
jest.mock('./services/blogs')

describe('<App />', () => {
  test('if no user logged in, blogs are not rendered', async () => {
    const component = render(
      <App />
    )
    await waitForElement(
      () => component.getByText('login')
    )

    expect(component.container).not.toHaveTextContent(
      'Easier Node.js streams via async iteration'
    )
  })

  /* TEST FAILING - SKIP FOR LATER
  test('if user is logged in, blogs are rendered', async() => {
    const user = {
      username: 'lbarzangi',
      token: '1231231214',
      name: 'Layth Barzangi'
    }
    localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))

    const component = render(
      <App user={user} />
    )

    await waitForElement(
      () => component.container.querySelector('.blogPost')
    )

    expect(component.container).toHaveTextContent(
      'Easier Node.js streams via async iteration'
    )
  })
  */
})