import { useState, useCallback, useRef } from 'react';

const useOptimisticList = () => {
  const [items, setItems] = useState([]);
  const pendingOps = useRef(new Set());

  const isPending = useCallback((id) => pendingOps.current.has(id), []);

  const optimisticAdd = useCallback(async (tempItem, apiCall) => {
    const tempId = tempItem.id || `temp-${Date.now()}`;
    const itemWithId = { ...tempItem, id: tempId };
    pendingOps.current.add(tempId);
    setItems((prev) => [itemWithId, ...prev]);

    try {
      const result = await apiCall();
      pendingOps.current.delete(tempId);
      // Replace temp item with server item
      setItems((prev) =>
        prev.map((item) => (item.id === tempId ? { ...result, id: result.id || result._id } : item))
      );
      return result;
    } catch (err) {
      pendingOps.current.delete(tempId);
      setItems((prev) => prev.filter((item) => item.id !== tempId));
      throw err;
    }
  }, []);

  const optimisticUpdate = useCallback(async (id, updates, apiCall) => {
    pendingOps.current.add(id);
    let original;
    setItems((prev) => {
      original = prev.find((item) => item.id === id);
      return prev.map((item) => (item.id === id ? { ...item, ...updates } : item));
    });

    try {
      const result = await apiCall();
      pendingOps.current.delete(id);
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...result, id: result.id || result._id } : item))
      );
      return result;
    } catch (err) {
      pendingOps.current.delete(id);
      if (original) {
        setItems((prev) => prev.map((item) => (item.id === id ? original : item)));
      }
      throw err;
    }
  }, []);

  const optimisticDelete = useCallback(async (id, apiCall) => {
    pendingOps.current.add(id);
    let original;
    setItems((prev) => {
      original = prev.find((item) => item.id === id);
      return prev.filter((item) => item.id !== id);
    });

    try {
      await apiCall();
      pendingOps.current.delete(id);
    } catch (err) {
      pendingOps.current.delete(id);
      if (original) {
        setItems((prev) => [...prev, original]);
      }
      throw err;
    }
  }, []);

  return { items, setItems, optimisticAdd, optimisticUpdate, optimisticDelete, isPending };
};

export default useOptimisticList;
