import { store } from "./app"

const createListItem = (bookmark) => {

    const li = document.createElement('li')
    li.className = 'list-group-item d-flex justify-content-between align-items-center'

    const div = document.createElement('div')
    div.className = `d-flex justify-content-center align-items-center gap-4`

    const img = document.createElement('img')
    img.src = `//logo.clearbit.com/${bookmark.name}`
    img.className = 'avatar'


    const text = document.createElement('p')
    text.innerHTML = bookmark.name
    text.className = 'domain_text  ml-4 mt-3 text-primary fw-semibold'
    text.onclick = () => {
        window.open(`${bookmark.url}`, '_blank')
    }

    div.append(img, text)

    const icons = document.createElement('div')
    icons.className = 'ml-auto'


    const fav = document.createElement('span')
    fav.className = `icon ${bookmark.isFav && "text-danger fs-5"}`
    const i = document.createElement('i')
    i.className = `${bookmark.isFav ? "fas" : "far"} fa-heart`
    fav.appendChild(i)
    fav.onclick = () => {
        store.dispatch({
            type: "TOGGLE_FAVOURITE",
            payload: bookmark.id,
        })
        localStorage.setItem("bookmarks", JSON.stringify(store.getState()))
    }


    const remove = document.createElement('span')
    remove.innerHTML = `<i class="fas fa-trash"><i>`
    remove.className = 'icon mx-3 '
    remove.onclick = () => {
        store.dispatch({
            type: "REMOVE_BOOKMARK",
            payload: bookmark.id,
        })
        localStorage.setItem("bookmarks", JSON.stringify(store.getState()))
    }

    icons.append(fav, remove)

    li.append(div, icons)

    return li;

}



export default createListItem;