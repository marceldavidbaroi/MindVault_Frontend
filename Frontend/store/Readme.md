# 🟢 Zustand Store Guidelines

### 1. File & Naming

- Store file: `use<Entity>Store.ts`
- State interface: `<Entity>State`
- Actions: `getAll<Entity>`, `create<Entity>`, `update<Entity>`, `delete<Entity>`
- Setter: `set<Entity>`

---

### 2. Structure

```ts
interface <Entity>State {
  stateKey: Type;                  // main state
  setStateKey: (value: Type) => void; // setter
  filters?: FilterType;            // optional
  meta?: MetaType;                 // optional
  <actionName>: (...params) => Promise<ApiResponse<Type>>;
}

export const use<Entity>Store = create<<Entity>State>((set, get) => ({
  stateKey: initialValue,
  setStateKey: (value) => set({ stateKey: value }),

  <actionName>: async (params) => {
    const res = await <service>.<method>(params);
    if (res.success && res.data) set({ stateKey: res.data });
    return res;
  },
}));
```

---

### 3. Best Practices

1. **Separate sections**: state, setters, actions.
2. **Use TypeScript interfaces** for state and API responses.
3. **Update store on successful API calls**.
4. **Use filters/meta** for lists/pagination.
5. **Use `get()`** to access current state when modifying arrays.
6. **Handle errors gracefully** and return default values.
7. **Keep naming consistent** for AI predictability.
