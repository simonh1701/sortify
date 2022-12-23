const swrOptions = {
  revalidateOnFocus: false,
  shouldRetryOnError: false,
  dedupingInterval: 5000,
  onError: (err, key) => {
    console.error(
      `An error occurred while fetching from ${key}. Status ${err.status}.`,
      err.info
    );
  },
};

export default swrOptions;
