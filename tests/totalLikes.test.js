const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('total likes', () => {
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
    
    test('when list has zero blogs, total likes equals 0', () => {
        const result = listHelper.totalLikes(listWithZeroBlogs)
        assert.strictEqual(result, 0)
    })

    test('when list has one blog, total likes equals that blog\'s likes', () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        assert.strictEqual(result, 5)
    })

    test('when list has many blogs, total likes calculates right', () => {
        const result = listHelper.totalLikes(listWithThreeBlogs)
        assert.strictEqual(result, 37)
    })
})