const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('favorite one', () => {
    const listWithZeroBlogs = []
    const listWithOneBlog = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        }
    ]

    const listWithThreeBlogs = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Title 1',
            author: 'fafurri',
            url: 'https://someURL.com/...',
            likes: 5,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Title 2',
            author: 'Fabri',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 12,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Title 3',
            author: 'Fabricio Paoloni',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 20,
            __v: 0
        }
    ]

    test('when list has zero blogs, returns "No blogs passed"', () => {
        const result = listHelper.favoriteBlog(listWithZeroBlogs)
        assert.strictEqual(result, "No blogs passed")
    })

    test('when list has one blog, returns that blog', () => {
        const result = listHelper.favoriteBlog(listWithOneBlog)
        assert.deepStrictEqual(result, {
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            likes: 5
        })
    })

    test('when list has many blogs, returns the more liked one', () => {
        const result = listHelper.favoriteBlog(listWithThreeBlogs)
        assert.deepStrictEqual(result, {
            title: 'Title 3',
            author: 'Fabricio Paoloni',
            likes: 20
        })
    })
})