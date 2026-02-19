'use client'

export default function TestBlog() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f5f5f5', 
      padding: '2rem'
    }}>
      <div style={{ 
        maxWidth: '1000px', 
        margin: '0 auto'
      }}>
        <h1 style={{ 
          textAlign: 'center', 
          marginBottom: '3rem',
          fontFamily: 'Arial, sans-serif'
        }}>
          Test Blog - Text Wrapping Demo
        </h1>

        {/* Post 1 - With Cover Image */}
        <article style={{
          backgroundColor: 'rgba(248, 235, 215, 0.8)',
          padding: '3rem',
          marginBottom: '3rem',
          borderRadius: '8px'
        }}>
          <img 
            src="/filler/BTC_1.6.jpeg" 
            alt="Cover" 
            style={{
              width: '300px',
              height: '300px',
              objectFit: 'cover',
              float: 'left',
              margin: '0 1rem 1rem 0',
              borderRadius: '4px'
            }}
          />
          <h2 style={{ margin: '0 0 0.5rem 0', fontFamily: 'Arial, sans-serif' }}>Post One - With Cover Image</h2>
          <p style={{ margin: '0 0 1rem 0', fontStyle: 'italic', color: '#666' }}>Subtitle goes here</p>
          
          <p style={{ textAlign: 'justify', lineHeight: '1.8', marginBottom: '1rem' }}>
            This is the first post with a cover image. The cover image floats to the left, and this text wraps around it naturally. 
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>

          <p style={{ textAlign: 'justify', lineHeight: '1.8', marginBottom: '1rem' }}>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            The text continues to wrap around the floating cover image until it reaches the bottom of the image.
          </p>

          <img 
            src="/filler/DETAILS_1.0.jpeg" 
            alt="Inline 1" 
            style={{
              maxWidth: '300px',
              height: 'auto',
              float: 'right',
              margin: '1rem 0 1rem 1rem',
              borderRadius: '4px'
            }}
          />

          <p style={{ textAlign: 'justify', lineHeight: '1.8', marginBottom: '1rem' }}>
            After the cover image, we have inline images. This first inline image floats right (alternating from cover). 
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, 
            totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
          </p>

          <p style={{ textAlign: 'justify', lineHeight: '1.8', marginBottom: '1rem' }}>
            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores 
            eos qui ratione voluptatem sequi nesciunt. The text wraps naturally around this floating image as well.
          </p>

          <img 
            src="/filler/DUO_1.0.jpeg" 
            alt="Inline 2" 
            style={{
              maxWidth: '300px',
              height: 'auto',
              float: 'left',
              margin: '1rem 1rem 1rem 0',
              borderRadius: '4px'
            }}
          />

          <p style={{ textAlign: 'justify', lineHeight: '1.8', marginBottom: '1rem' }}>
            Third image overall, floats left. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, 
            consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
          </p>

          <img 
            src="/filler/BTC_1.7.jpeg" 
            alt="Inline 3" 
            style={{
              maxWidth: '300px',
              height: 'auto',
              float: 'right',
              margin: '1rem 0 1rem 1rem',
              borderRadius: '4px'
            }}
          />

          <p style={{ textAlign: 'justify', lineHeight: '1.8', marginBottom: '1rem' }}>
            And a fourth image to complete this post. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, 
            nisi ut aliquid ex ea commodi consequatur. Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.
          </p>

          <p style={{ textAlign: 'justify', lineHeight: '1.8', marginBottom: '1rem' }}>
            This final paragraph flows naturally with the rest of the content. 
            At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti.
          </p>
        </article>

        {/* Post 2 - With Cover Image */}
        <article style={{
          backgroundColor: 'rgba(248, 235, 215, 0.8)',
          padding: '3rem',
          marginBottom: '3rem',
          borderRadius: '8px'
        }}>
          <img 
            src="/filler/DETAILS_1.0.jpeg" 
            alt="Cover" 
            style={{
              width: '300px',
              height: '300px',
              objectFit: 'cover',
              float: 'left',
              margin: '0 1rem 1rem 0',
              borderRadius: '4px'
            }}
          />
          <h2 style={{ margin: '0 0 0.5rem 0', fontFamily: 'Arial, sans-serif' }}>Post Two - With Cover Image</h2>
          <p style={{ margin: '0 0 1rem 0', fontStyle: 'italic', color: '#666' }}>Another subtitle</p>
          
          <p style={{ textAlign: 'justify', lineHeight: '1.8', marginBottom: '1rem' }}>
            This is the second post, also with a cover image floating left. The title and subtitle wrap around the cover image, 
            followed by the body text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt 
            ut labore et dolore magna aliqua.
          </p>

          <p style={{ textAlign: 'justify', lineHeight: '1.8', marginBottom: '1rem' }}>
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </p>

          <img 
            src="/filler/DUO_2.0.jpeg" 
            alt="Inline 1" 
            style={{
              maxWidth: '300px',
              height: 'auto',
              float: 'right',
              margin: '1rem 0 1rem 1rem',
              borderRadius: '4px'
            }}
          />

          <p style={{ textAlign: 'justify', lineHeight: '1.8', marginBottom: '1rem' }}>
            First inline image floats right (alternating from cover). Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt 
            mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.
          </p>

          <img 
            src="/filler/DUO_2.1.jpeg" 
            alt="Inline 2" 
            style={{
              maxWidth: '300px',
              height: 'auto',
              float: 'left',
              margin: '1rem 1rem 1rem 0',
              borderRadius: '4px'
            }}
          />

          <p style={{ textAlign: 'justify', lineHeight: '1.8', marginBottom: '1rem' }}>
            Second inline image floats left. Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae 
            dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.
          </p>

          <img 
            src="/filler/BTC_1.8.jpeg" 
            alt="Inline 3" 
            style={{
              maxWidth: '300px',
              height: 'auto',
              float: 'right',
              margin: '1rem 0 1rem 1rem',
              borderRadius: '4px'
            }}
          />

          <p style={{ textAlign: 'justify', lineHeight: '1.8', marginBottom: '1rem' }}>
            Third inline image. Sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. 
            Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.
          </p>

          <p style={{ textAlign: 'justify', lineHeight: '1.8', marginBottom: '1rem' }}>
            Final paragraph flows naturally. Sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. 
            Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.
          </p>
        </article>

        {/* Post 3 - Without Cover Image */}
        <article style={{
          backgroundColor: 'rgba(248, 235, 215, 0.8)',
          padding: '3rem',
          marginBottom: '3rem',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h2 style={{ margin: '0 0 0.5rem 0', fontFamily: 'Arial, sans-serif' }}>Post Three - Without Cover Image</h2>
          <p style={{ margin: '0 0 2rem 0', fontStyle: 'italic', color: '#666' }}>Centered subtitle</p>
          
          <div style={{ textAlign: 'justify' }}>
            <p style={{ lineHeight: '1.8', marginBottom: '1rem' }}>
              This post has no cover image, so the title and subtitle are centered. The body text starts at full width. 
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>

            <img 
              src="/filler/DUO_1.1.jpeg" 
              alt="Inline 1" 
              style={{
                maxWidth: '300px',
                height: 'auto',
                float: 'left',
                margin: '1rem 1rem 1rem 0',
                borderRadius: '4px'
              }}
            />

            <p style={{ lineHeight: '1.8', marginBottom: '1rem' }}>
              First inline image floats left. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip 
              ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>

            <p style={{ lineHeight: '1.8', marginBottom: '1rem' }}>
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. 
              The text wraps around the floating image naturally.
            </p>

            <img 
              src="/filler/DETAILS_1.1.jpeg" 
              alt="Inline 2" 
              style={{
                maxWidth: '300px',
                height: 'auto',
                float: 'right',
                margin: '1rem 0 1rem 1rem',
                borderRadius: '4px'
              }}
            />

            <p style={{ lineHeight: '1.8', marginBottom: '1rem' }}>
              Second inline image floats right. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, 
              totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            </p>

            <img 
              src="/filler/DETAILS_1.2.jpeg" 
              alt="Inline 3" 
              style={{
                maxWidth: '300px',
                height: 'auto',
                float: 'left',
                margin: '1rem 1rem 1rem 0',
                borderRadius: '4px'
              }}
            />

            <p style={{ lineHeight: '1.8', marginBottom: '1rem' }}>
              Third inline image floats left. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur 
              magni dolores eos qui ratione voluptatem sequi nesciunt.
            </p>

            <img 
              src="/filler/DETAILS_1.3.jpeg" 
              alt="Inline 4" 
              style={{
                maxWidth: '300px',
                height: 'auto',
                float: 'right',
                margin: '1rem 0 1rem 1rem',
                borderRadius: '4px'
              }}
            />

            <p style={{ lineHeight: '1.8', marginBottom: '1rem' }}>
              Fourth inline image. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, 
              sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
            </p>

            <p style={{ lineHeight: '1.8', marginBottom: '1rem' }}>
              Final paragraph flows naturally with the content. Ut enim ad minima veniam, quis nostrum exercitationem 
              ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.
            </p>
          </div>
        </article>
      </div>
    </div>
  )
}
