import { Weak } from '../../../../helpers'
import { PropsUIPageEnd } from '../../../../types/pages'
import { ReactFactoryContext } from '../../factory'
import { Footer } from './templates/footer'
import { Sidebar } from './templates/sidebar'
import LogoSvg from '../../../../../assets/images/logo.svg'
import { Page } from './templates/page'
import TextBundle from '../../../../text_bundle'
import { Translator } from '../../../../translator'
import { BodyLarge, Title1 } from '../elements/text'

type Props = Weak<PropsUIPageEnd> & ReactFactoryContext

export const EndPage = (props: Props): JSX.Element => {
  const { title, text, text1 } = prepareCopy(props)

  const footer: JSX.Element = <Footer />

  const sidebar: JSX.Element = <Sidebar logo={LogoSvg} />

  const body: JSX.Element = (
    <>
      <Title1 text={title} />
      <BodyLarge text={text} />
      <BodyLarge text={text1} />
    </>
  )

  return (
    <Page
      body={body}
      sidebar={sidebar}
      footer={footer}
    />
  )
}
// try add date as another identifier
interface Copy {
  title: string
  text: string
  text1: string
}

function prepareCopy ({ locale }: Props): Copy {
  return {
    title: Translator.translate(title, locale),
    text: Translator.translate(text, locale),
    text1: Translator.translate(text1, locale)
  }
}

function generateRandomString (length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  let result = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    result += characters.charAt(randomIndex)
  }
  return result
}

function getCurrentTimeAsString (): string {
  const now = new Date()
  const year = now.getFullYear().toString()
  const month = (now.getMonth() + 1).toString().padStart(2, '0') // Month is zero-based, so add 1.
  const day = now.getDate().toString().padStart(2, '0')
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  const seconds = now.getSeconds().toString().padStart(2, '0')
  return `${year}${month}${day}${hours}${minutes}${seconds}`
}

const letters = generateRandomString(5)
const date = getCurrentTimeAsString()

// Combine the 'abcde' prefix with the random numbers and letters
const randomStringen: string = `Your return code is don0923${letters}${date}`
const randomStringnl: string = `Uw retourcode is don0923${letters}${date} `

const title = new TextBundle()
  .add('en', 'Thank you')
  .add('nl', 'Bedankt')

const text = new TextBundle()
  .add('en', randomStringen)
  .add('nl', randomStringnl)

const text1 = new TextBundle()
  .add('en', '\nPlease copy and paste your return code into the survey page. Once you have done this, the data donation process is complete and you can close this page.')
  .add('nl', '\nGelieve uw terugkeercode te kopiëren en te plakken op de enquêtepagina. Nadat je hiermee klaar bent, is de gegevensdonatie voltooid en kun je deze pagina sluiten.')
