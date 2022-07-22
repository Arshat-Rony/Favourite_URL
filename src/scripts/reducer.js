const init = []
let bookmarks;
let favourites;

const reducer = (state = init, action) => {
    switch (action.type) {
        case "ADD_BOOKMARK": {
            console.log(action.payload)
            return state.concat(action.payload)
        }
        case "REMOVE_BOOKMARK": {
            return bookmarks = state.filter(bookmark => bookmark.id !== action.payload)
        }

        case "TOGGLE_FAVOURITE": {
            return favourites = state.map(bookmark => {
                if (bookmark.id === action.payload) {
                    bookmark.isFav = !bookmark.isFav;
                }
                return bookmark;
            })
        }
    }
}


export default reducer;