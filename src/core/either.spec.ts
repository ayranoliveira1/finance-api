import { Either, left, right } from './either'

function doSomenthing(shouldSuccess: boolean): Either<string, number> {
  if (shouldSuccess) {
    return right(10)
  }

  return left('error')
}

test('success result', () => {
  const success = doSomenthing(true)

  expect(success.isRight()).toBe(true)
  expect(success.isLeft()).toBe(false)
})

test('Error result', () => {
  const error = doSomenthing(false)

  expect(error.isLeft()).toBe(true)
  expect(error.isRight()).toBe(false)
})
