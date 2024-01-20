import { expect, test } from '@playwright/test'

test.describe('Devices', () => {
  test('should get devices', async ({ request }) => {
    const create = await request.get('/api/v1/devices')
    const createJson = await create.json()

    expect(create.status()).toBe(200)
    expect(createJson).toHaveLength(3)
    expect(createJson[0]['device.serial'].value).toBe('test1')
    expect(createJson[1]['device.serial'].value).toBe('test2')
    expect(createJson[2]['device.serial'].value).toBe('test3')
  })
})
