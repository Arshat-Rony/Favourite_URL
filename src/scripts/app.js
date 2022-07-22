import createStore from "./createstore";
import reducer from "./reducer";
import createListItem from "./createList";

let init = [];



// checking data of localStorage 
if (localStorage.getItem('bookmarks')) {
    init = JSON.parse(localStorage.getItem("bookmarks"))
}

export const store = createStore(reducer, init)

console.log(store)



window.onload = () => {
    const urlInput = document.getElementById('urlInput')
    const favouriteBookmarks = document.getElementById("favouriteBookmarks")
    const allBookmarks = document.getElementById('allBookmarks')
    let toalFavList = document.getElementById("totalFavList")


    const totalBookmark = document.getElementById("totalBookMark")

    if (store.getState().length > 0) {

        // rendering previous data form localstorage 
        store.getState().forEach(bookmark => {
            if (bookmark.isFav == false) {
                const li = createListItem(bookmark)
                allBookmarks.appendChild(li)
            }

        })

        // rendering previous favouriteBookmarks from localstorage 
        store.getState().forEach(bookmark => {
            if (bookmark.isFav) {
                const li = createListItem(bookmark)
                favouriteBookmarks.appendChild(li)

            }
        })
    }


    // adding eventListener to the input key up 
    urlInput.onkeyup = (e) => {
        if (e.key === 'Enter') {
            const url = e.target.value;
            const name = nameFromUrl(url);
            const isFav = false
            const id = genRanHex(16)
            if (store.getState().length > 0) {
                const exist = store.getState().filter(bookmark => bookmark.name == name)
                if (exist == []) {
                    console.log(exist)
                    e.target.value = ''
                    return;
                }
            }
            store.dispatch({
                type: 'ADD_BOOKMARK',
                payload: {
                    url, name, isFav, id
                }
            })
            localStorage.setItem("bookmarks", JSON.stringify(store.getState()))
            e.target.value = ''



        }
    }


    // new subscribe for all link to add bookmarks
    store.subscribe(() => {
        allBookmarks.innerHTML = ''
        store.getState().forEach(bookmark => {
            if (bookmark.isFav == false) {
                const li = createListItem(bookmark)
                allBookmarks.appendChild(li)

            }
        })
    })


    //new subscribe for favourite bookmarks 
    store.subscribe(() => {
        favouriteBookmarks.innerHTML = ''
        store.getState().forEach(bookmark => {
            if (bookmark.isFav) {
                const li = createListItem(bookmark)
                favouriteBookmarks.appendChild(li)

            }
        })
    })

    const favArray = store.getState().filter((b) => b.isFav !== false);
    const totalArray = store.getState().filter((b) => b.isFav == false);

    toalFavList.textContent = favArray.length;
    totalBookmark.textContent = totalArray.length;
}



// getting the domain name from an url 
const nameFromUrl = url => {
    return url.match(/:\/\/(.[^/]+)/)[1];
}



// generating randomBytes 
const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');


