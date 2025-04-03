const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const initialValue = 0
    const likes = blogs.reduce(
        (accumulator, currentValue) => accumulator + currentValue.likes,
        initialValue,
    )
    console.log(likes)
    return likes
}

module.exports = {
    dummy,
    totalLikes
}