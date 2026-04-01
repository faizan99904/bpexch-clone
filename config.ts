// Testing URI
// export const BASE_URL_API = "https://vertexapi-44ir.onrender.com";


export const BASE_URL_API = "https://vertexapi-green-sky-9763.fly.dev";
export const BAse_URL1 = 'https://vertexapi-green-sky-9763.fly.dev'

export const CONFIG = {
  // Login
  login: BASE_URL_API + "/api/auth/login",
  logout: BASE_URL_API + "/api/auth/logout",

  // users
  getUser: BASE_URL_API + "/api/users/get",
  createUser: BASE_URL_API + "/api/users/create",
  updateUser: BASE_URL_API + "/api/users",
  deleteUser: BASE_URL_API + "/api/users",
  userBalance: BASE_URL_API + "/api/users/getAgentbalance",
  getAllDeletedUsers: BASE_URL_API + "/api/users/deletedusers",
  restoreDeletedUser: BASE_URL_API + "/api/users/restore",
  changePasswordByParent: BASE_URL_API + "/api/users/changePasswordByParent",
  changePasswordByUser: BASE_URL_API + "/api/users/changePasswordByUser",
  getUserProfile: BASE_URL_API + "/api/users/userprofile",

  // Deposit/Withdraw
  depositBalance: BASE_URL_API + "/api/transactions/deposit",
  withdrawBalance: BASE_URL_API + "/api/transactions/withdraw",
  getAllStatement: BASE_URL_API + "/api/transactions/getAllStatement",

  // Rounds
  getAllRounds: BASE_URL_API + "/api/rounds/list/getAllRounds",
  roundDetails: BASE_URL_API + "/api/rounds/details",
  betSattlement: BASE_URL_API + "/api/rounds/betsattlement",
  getRoundBets: BASE_URL_API + "/api/bets/getRoundBets",

  // Stats
  allStats: BASE_URL_API + "/api/stats/allStats",

  // Banks
  getBankDetails: BASE_URL_API + "/api/banks/get/bankDetails",
  addBank: BASE_URL_API + "/api/banks/add/bank",
  updateBankDetails: BASE_URL_API + "/api/banks/update/bank",
  deleteBank: BASE_URL_API + '/api/banks/deletebank',

  // Request D/W
  requestDW: BASE_URL_API + "/api/banking/users/request/dw",
  updateRequestDW: BASE_URL_API + "/api/banking/users/request/dw/update",

  // Bets
  getAllBets: BASE_URL_API + "/api/bets/getallbets",
  getUserBetsByParent: BASE_URL_API + "/api/bets/getUserBetsParent",
  getRoundPl: BASE_URL_API + "/api/roundpl/getRoundPl",
  //
  maintenance: BASE_URL_API + "/api/maintenance/Aviator",

  // Multiplayer
  addMultiplayer: BASE_URL_API + "/api/multiplier/add",
  getMultiplayer: BASE_URL_API + "/api/multiplier/get",
  deleteMultiplier: BASE_URL_API + "/api/multiplier/delete/",

  // Event 
  getAllEvent: BASE_URL_API + '/api/event/getallevent',
  createEvent: BASE_URL_API + '/api/event/createevent',
  updateEvent: BASE_URL_API + '/api/event/updateevent',

  // customer support

  addCustomerSupport: BASE_URL_API + '/api/customersupport/add',
  getCustomerSupport: BASE_URL_API + '/api/customersupport/getall',
  updateCustomerSupport: BASE_URL_API + '/api/customersupport/update',
  deleteCustomerSupport: BASE_URL_API + '/api/customersupport/delete/',

  // profit loss 
  getReportList: BASE_URL_API + '/api/reports/eventrange/parent',
  getRoundRange: BASE_URL_API + '/api/reports/roundsrange/parent',
  getUserBets: BAse_URL1 + '/api/bets/bethistory/admin',
  // Banner
  getBanner: BASE_URL_API + '/api/event/getbanner',
  addBanner: BASE_URL_API + '/api/event/addbanner',
  updateBanner: BASE_URL_API + '/api/event/update',
  deleteBanner: BASE_URL_API + '/api/event/deletebanner',

  // Bonus 
  getBonus: BASE_URL_API + '/api/users/get/welcome-bonus',
  updateBonus: BASE_URL_API + '/api/users/update/welcome-bonus',

  // activity logs 
  activityLog: BASE_URL_API + '/api/auth/getloginactivity',

  // user p&l reports
  userPlReport: BASE_URL_API + '/api/reports/eventrange/user',
  roundsRange: BASE_URL_API + '/api/reports/roundsrange/user',
  roundHistory: BASE_URL_API + '/api/bets/bethistory/user',

  //  operator 

  createOperator: BASE_URL_API + '/api/operator/create',
  getOperatorGames: BASE_URL_API + '/api/operator/games/',
  addGame: BASE_URL_API + '/api/operator/games',
  updateGameRtp: BASE_URL_API + '/api/operator/games',
  updateGameLimits: BASE_URL_API + '/api/operator/games',
  adminOperator: BASE_URL_API + '/api/operator/games'
}
