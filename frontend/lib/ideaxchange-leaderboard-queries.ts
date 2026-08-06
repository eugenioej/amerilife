export type LeaderboardRowGraphql = {
  rank?: string | null;
  affiliate?: string | null;
  ytdAmount?: string | null;
  lytdAmount?: string | null;
  vsLytd?: string | null;
  vsLqtd?: string | null;
  vsLmtd?: string | null;
  trend?: string | null;
};

export type LeaderboardTableGraphql = {
  slug?: string | null;
  title?: string | null;
  ideaxchangeLbTableFields?: {
    reportDate?: string | null;
    rowCount?: number | null;
    schema?: string | null;
    visibility?: string | null;
    rows?: LeaderboardRowGraphql[] | null;
  } | null;
};

export type LeaderboardTablesResult = {
  ideaxchangeLbTables?: {
    nodes: LeaderboardTableGraphql[];
  };
};

export const GET_LEADERBOARD_TABLES = `
  query GetLeaderboardTables {
    ideaxchangeLbTables(first: 20, where: { orderby: { field: MENU_ORDER, order: ASC }, status: PUBLISH }) {
      nodes {
        slug
        title
        ideaxchangeLbTableFields {
          reportDate
          rowCount
          schema
          visibility
          rows {
            rank
            affiliate
            ytdAmount
            lytdAmount
            vsLytd
            vsLqtd
            vsLmtd
            trend
          }
        }
      }
    }
  }
`;
