import { render } from '@testing-library/react'
import Page from '@/app/page'

describe('Page', () => {
  it('renders a heading', () => {
    const lng = 'en'
    const page = render(<Page params={lng} />)

    expect(page).toBeDefined()
  })
})
