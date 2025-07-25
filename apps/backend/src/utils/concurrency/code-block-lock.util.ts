const locks = new Map();

export async function getOrLockAndExecute<T>(key:string, taskFn:() => Promise<T>) {
  if (locks.has(key)) {
    return await locks.get(key);
  }

  const taskPromise = taskFn();
  locks.set(key, taskPromise);

  try {
    return  await taskPromise;
  } finally {
    locks.delete(key);
  }
}