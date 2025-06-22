const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const initialValue = 0
    const likes = blogs.reduce(
        (accumulator, currentValue) => accumulator + currentValue.likes,
        initialValue,
    )
    // console.log(likes)
    return likes
}

const favoriteBlog = blogs => {
    if(blogs.length === 0){
        return "No blogs passed"
    }
    let favoriteOne = blogs[0]
    for (let i = 0; i < blogs.length; i++) {
        if (blogs[i].likes > favoriteOne.likes) {
            favoriteOne = blogs[i]
        }
    }
    
    let returnOne = {
        title: favoriteOne["title"],
        author: favoriteOne.author,
        likes: favoriteOne.likes
    }
    return returnOne
}

const mostBlogs = blogs => {
    
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}