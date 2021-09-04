const userKey = 'userKey';
const timeKey = 'timeKey';

function setStorage<T = any>(key: string, val: T) {
  sessionStorage.setItem(key, JSON.stringify(val));
}

function getStoreage<T = any>(key: string, defaultVal?: T): T | undefined {
  const val = sessionStorage.getItem(key);
  if (val === null) {
    return defaultVal;
  }

  return JSON.parse(val);
}

export function setCurrentUser(currentUser: API.LoginResultData) {
  setStorage(userKey, currentUser);
  setStorage(timeKey, new Date().getTime());
}

export function getCurrentUser() {
  const time = getStoreage(timeKey);
  if (!time) {
    return undefined;
  }
  if (new Date().getTime() - time > 2.5 * 3600 * 1000) {
    return undefined;
  }
  return getStoreage<API.LoginResultData>(userKey);
}

export function clearCurrentUser() {
  sessionStorage.removeItem(userKey);
  sessionStorage.removeItem(timeKey);
}
