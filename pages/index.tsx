import { Auth, ThemeSupa, ThemeMinimal } from '@supabase/auth-ui-react'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import Link  from 'next/link';
import Account from '../components/Account'

const Home = () => {
  const session = useSession()
  const supabase = useSupabaseClient()

  return (
    <div>
      <h1 className="">~ GIFT GUIDE ~ </h1>
      <h2 className=''>~ An AI Powered Gift Suggester ~</h2>
      <p> ~ A how-to description will go here ~</p>
      {!session ? (
        <div className="mx-auto max-w-xl">
          <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} theme="light" />
        </div>
        ) : (
          <div>
            <Link href="/newGuidePage">
              <button>Create a New Gift Guide</button>
            </Link>
            <Link href="/savedGuidesPage">
              <button>Go to Saved Gift Guides</button>
            </Link>
            <div>Update Account: 
              <Account session={session} />
            </div>
            {/* <div>
              <button
                className="button block"
                onClick={() => supabase.auth.signOut()}
              >
                Sign Out
              </button>
            </div> */}
        </div>

      )}
    </div>
  )
}

export default Home