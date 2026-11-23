import {Provider} from "./components/ui/provider.tsx";

// @ts-ignore
function App({ Component, pageProps }) {
  return (
    <Provider>
      <Component {...pageProps} />
    </Provider>
  )
}

export default App;