// SPA Sigle page Aplication useEffect
// SSR Server Side Rendering getServerSideProps
// SSG Static Side Generation 



export default function Home(props) {
  return (
    <div>
      <h1>Index</h1>

      <p>{JSON.stringify(props.episodes)}</p>
    </div >
  )
}


export async function getStaticProps() {
  const response = await fetch('http://localhost:3333/episodes')
  const data = await response.json()

  return {
    props: {
      episodes: data,
    },
    revalidate: 60 * 60 * 8,
  }

}