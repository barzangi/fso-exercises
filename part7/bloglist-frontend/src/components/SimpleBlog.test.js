import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import SimpleBlog from './SimpleBlog'

test('renders content', () => {
  const blog = {
    title: 'React Patterns',
    author: 'Michael Chan',
    likes: 7
  }

  const component = render(
    <SimpleBlog blog={blog} />
  )

  const div = component.container.querySelector('.simpleBlog')
  expect(div).toHaveTextContent('React Patterns')
  expect(div).toHaveTextContent('Michael Chan')
  expect(div).toHaveTextContent('Blog has 7 likes')
})

test('clicking the button twice calls event handler twice', () => {
  const blog = {
    title: 'React Patterns',
    author: 'Michael Chan',
    likes: 7
  }

  const mockHandler = jest.fn()

  const { getByText } = render(
    <SimpleBlog blog={blog} onClick={mockHandler} />
  )

  const button = getByText('like')
  fireEvent.click(button)
  fireEvent.click(button)

  expect(mockHandler.mock.calls.length).toBe(2)
})