import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('Expandable blog post', () => {
  const blog = {
    title: 'React Patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com',
    likes: 7,
    user: {
      username: 'ahellas'
    }
  }

  const loggedInUser = {
    username: 'ahellas'
  }

  let component

  beforeEach(() => {
    component = render(
      <Blog blog={blog} loggedInUser={loggedInUser}>
      </Blog>
    )
  })

  test('at start, the blog details are not displayed (only header with title and author)', () => {
    const div = component.container.querySelector('.blogDetails')
    expect(div).toHaveStyle('display: none')
  })

  test('after clicking the header, blog details are displayed', () => {
    const clickableHeader = component.container.querySelector('.blogHeader')
    fireEvent.click(clickableHeader)

    const div = component.container.querySelector('.blogDetails')
    expect(div).not.toHaveStyle('display: none')
  })
})