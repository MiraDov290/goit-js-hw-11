import axios from "axios";
import Notiflix from 'notiflix';
import "simplelightbox/dist/simple-lightbox.min.css";
import { script } from './js/script';

const refs = {
    formEl: document.querySelector('.search-form'),
    inputEl: document.querySelector('input'),
    submitEl: document.querySelector('[tupe="submit"]'),
    galleryEl: document.querySelector('.gallery'),
    loadMore: document.querySelector('.load-more'),
};

const API_KEY = '38176704-7a0dd5a9a2fe56e0ef327804b';
const BASE_URL = 'https://pixabay.com/api';
const PER_PAG = '40';
let changePage = 1;
let changeQuery = '';
let reguestUrl = '';

refs.formEl.addEventListener('submit', onFormSubmit);
refs.loadMore.addEventListener('click', onLoadMore);

async function onFormSubmit(ev) {
    ev.preventDefault();
    changeQuery = refs.inputEl.value.trim();
    changePage = 1;

    clearGalery();
    await fetchSearchInData();
}

async function fetchSearchInData() {
    reguestUrl = getRequest(changeQuery, changePage);

    try {
        const data = await fetchImage(reguestUrl);
        chackFetchResult(data);
    } catch (error) {
        Notiflix.Notify.failure(
            "Sorry! An error occurred while getting the image. Please try again later"
        );
    }
}

function chackFetchResult(data) {
    const { hits, totalHits } = data;
    if (hits.length === 0) {
        Notiflix.Notify.failure(
            "Sorry, there are no images matching your search query. Please try again."
        );
        hideLoadMoreBtn();
    } else {
        script(hits);
        if (changePage * PER_PAG <= totalHits) {
            showLoadMoreBtn();
        } else {
            hideLoadMoreBtn();
            Notiflix.Notify.info(
                "We're sorry, but you've reached the end of search results."
            );
        }
    }
}

function getRequest(query, page) {
    const url = new URL(BASE_URL);
    url.searchParams.append('key', API_KEY);
    url.searchParams.append('q', query);
    url.searchParams.append('image_tupe', 'photo');
    url.searchParams.append('orientation', 'horizontal');
    url.searchParams.append('safesearch', 'true');
    url.searchParams.append('page', page.toString());
    url.searchParams.append('per_page', PER_PAG.toString());
    return url.toString();
}

function clearGalery() {
    refs.galleryEl.innerHTML = '';
}

function hideLoadMoreBtn() {
    refs.loadMore.style.display = 'none';
}

function showLoadMoreBtn() {
    refs.loadMore.style.display = 'block';
}

async function onLoadMore() {
    changePage += 1;
    await fetchSearchInData();
}

async function fetchImage(reguestUrl) {
    try {
        const reguest = await axios.get(reguestUrl);
        const data = reguest.data;
        return data;
    } catch (error) {
        console.error(error);
    }
}



