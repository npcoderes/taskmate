import { useDispatch, useSelector } from 'react-redux';

export const useAppDispatch = () => useDispatch();
export const useAppSelector = (selector) => useSelector(selector);

export const useAuth = () => {
  return useAppSelector((state) => state.auth);
};

export const useTasks = () => {
  return useAppSelector((state) => state.tasks);
};
