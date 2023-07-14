import { Counter } from "./components/Counter";
import Games from "./admin/Games";
import { Home } from "./components/Home";
import { Explore } from "./user/Explore";
import SearchPage from "./user/SearchPage";
import RentGame from "./user/RentGame";
import AddGame from "./admin/AddGame";
import Contracts from "./admin/Contracts";
import AddContract from "./admin/AddContract";
import EditContract from "./admin/EditContract";
import ContractDetail from "./admin/ContractDetail";
import EditGame from "./admin/EditGame";
import GameDetail from "./admin/GameDetail";
import GameInfo from "./user/GameInfo";
import Dashboard from "./admin/Dashboard";

const AppRoutes = [
  {
    index: true,
    element: <Home />
  },
  {
    path: '/counter',
    element: <Counter />
  },
  {
    path: '/games',
    element: <Games />
  },
  {
    path: '/explore',
    element: <Explore />
  },
  {
    path: '/addgame',
    element: <AddGame />
  },
  {
    path: '/edit/:gameId',
    element: <EditGame />
  },
  {
    path: 'detail/:gameId',
    element: <GameDetail />
  },
  {
    path: '/search',
    element: <SearchPage />
  },
  {
    path: 'rent/:gameId',
    element: <RentGame />
  },
  {
    path: '/contracts',
    element: <Contracts />
  },
  {
    path: '/addcontract',
    element: <AddContract />
  },
  {
    path: '/contracts/edit/:contractId',
    element: <EditContract />
  },
  {
    path: '/contracts/detail/:contractId',
    element: <ContractDetail />
  },
  {
    path: 'info/:gameId',
    element: <GameInfo />
  },
  {
    path: 'dashboard',
    element: <Dashboard/>
  }
];

export default AppRoutes;