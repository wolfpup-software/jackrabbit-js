// time with fallback because nodejs consistently ruins my life
//
// any kind of serious development is still not interoperable
// between the browser and the server in 2021
// nodejs has failed me and everyone
const getNowAsMilliseconds = () => {
    if (performance !== undefined) {
        return performance.now();
    }
    return Date.now();
};
export { getNowAsMilliseconds };
