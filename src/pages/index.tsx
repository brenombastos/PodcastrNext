import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useContext } from 'react';

import { PlayerContext } from '../contexts/PlayerContext';
import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';
import styles from './home.module.scss';


type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  publishedAT: string;
  duration: number;
  durationAsString: string;
  url: string;
}

type HomeProps = {
  latestEpisodes: Episode[];
  allEpisodes: Episode[];
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {


  const { play } = useContext(PlayerContext)

  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Útimos lançamentos </h2>

        <ul>
          {latestEpisodes.map(ep => {
            return (
              <li key={ep.id}>
                <Image
                  width={200}
                  height={200}
                  src={ep.thumbnail}
                  alt={ep.title}
                  objectFit="cover"
                />

                <div className={styles.episodeDetails}>
                  <Link href={`/episodes/${ep.id}`}>
                    <a >{ep.title}</a>
                  </Link>
                  <p>{ep.members}</p>
                  <span>{ep.publishedAT}</span>
                  <span>{ep.durationAsString}</span>
                </div>

                <button type="button" onClick={() => play(ep)}>
                  <img src="/play-green.svg" alt="Tocar episódio" />
                </button>
              </li>
            )
          })}
        </ul>
      </section>
      <section className={styles.allEpisodes}>
        <h2>Todos episódios</h2>

        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {allEpisodes.map(allEp => {
              return (
                <tr key={allEp.id}>
                  <td style={{ width: 72 }}>
                    <Image
                      width={120}
                      height={120}
                      src={allEp.thumbnail}
                      alt={allEp.title}
                      objectFit="cover"
                    />
                  </td>
                  <Link href={`/episodes/${allEp.id}`}>
                    <td>
                      <a >{allEp.title}</a>
                    </td>
                  </Link>
                  <td>{allEp.members}</td>
                  <td style={{ width: 100 }}>{allEp.publishedAT}</td>
                  <td>{allEp.durationAsString}</td>
                  <td>
                    <button type="button" onClick={() => play(allEp)}>
                      <img src="/play-green.svg" alt="Tocar episódio" />
                    </button>
                  </td>

                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
    </div >
  )
}


export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', { //?_limit=12&_sort=published_at&_order=desc
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })
  // const data = response.data

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAT: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      url: episode.file.url,
    };
  })

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);
  return {
    props: {
      latestEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8,
  }

}