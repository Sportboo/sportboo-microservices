import { Prisma } from "@prisma/client";

export const LoggingExtension = Prisma.defineExtension((client) => {

  return client.$extends({
    name: 'loggingExtension',
    query: {
      // playerStatistic: {
      //   async create({ model, operation, args, query }) {
      //       console.log('CREATE')
      //       const result = await query(args)
      //       return result;
      //   },
      // },
    },
  });
});
