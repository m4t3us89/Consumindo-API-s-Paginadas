(() => {
  const urlBase = "http://jsonplaceholder.typicode.com/";

  let limit = 300;
  let page = 0;

  async function fetchPhotos({ page, limit, done }) {
    if (done) return;

    return await (
      await await fetch(
        `${urlBase}photos?_start=${
          page == 0 ? page : page * limit
        }&_limit=${limit}`
      )
    ).json();
  }

  function actualPhotos({ limit }) {
    return {
      [Symbol.asyncIterator]: () => {
        return {
          next: function () {
            page++;
            return fetchPhotos({ page, limit, done: false });
          },
          previous: function () {
            if (page > 0) {
              page--;
              return fetchPhotos({ page, limit, done: false });
            }
            return fetchPhotos({ page: 0, limit, done: true });
          },
        };
      },
    };
  }

  try {
    const someCatPics = actualPhotos({ limit });
    const { next, previous } = someCatPics[Symbol.asyncIterator]();

    document
      .querySelector("#next")
      .addEventListener("click", () => next().then(console.log));
    document
      .querySelector("#previous")
      .addEventListener("click", () => previous().then(console.log));
  } catch (error) {
    console.log(error);
  }

  fetchPhotos({ page, limit });
})();
