export default [
    {
      input: "./build/jackrabbit.js",
      output: {
        file: "./esmodules/jackrabbit.js",
        format: "es",
      },
    },
    {
      input: './build/jackrabbit.test.js',
      output: {
        file: './esmodules/jackrabbit.test.js',
        format: "es",
      }
    },
    {
      input: "./build-nodejs/jackrabbit.js",
      output: {
        file: "./nodejs/jackrabbit.js",
        format: "es",
      },
    },
    {
      input: './build-nodejs/jackrabbit.test.js',
      output: {
        file: './nodejs/jackrabbit.test.js',
        format: "es",
      }
    },
  ];
  