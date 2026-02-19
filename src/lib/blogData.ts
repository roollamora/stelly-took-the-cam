export interface BlogPost {
  id: number
  title: string
  subtitle: string
  subtitlePosition: 'before' | 'after'
  category: string
  date: string
  tags: string[]
  coverImage: string
  content: string
  images: string[]
}

// Import the database service for data migration
import { dataService } from './database/dataService'
import type { BlogPost as DBBlogPost } from './database/schema'

// Default blog posts
const defaultPosts: BlogPost[] = [
  // Set 1
  {
    id: 1,
    title: 'Urban Shadows and Light',
    subtitle: 'Exploring contrast in city photography',
    subtitlePosition: 'after',
    category: 'Street Photography',
    date: '2022-03-15',
    tags: ['urban', 'shadows', 'contrast', 'city'],
    coverImage: '/filler/BTC_1.6.jpeg',
    content: `The interplay between light and shadow in urban environments creates some of the most compelling photographic opportunities. Every street corner becomes a stage where drama unfolds through the simple dance of illumination and darkness. The harsh midday sun casting sharp shadows between buildings, the soft glow of streetlights painting warm pools on wet pavement, the dramatic silhouettes of pedestrians against bright storefronts.

<img src="/filler/DETAILS_1.0.jpeg" alt="Urban detail" />

Walking through the city with a camera teaches you to see differently. You begin to notice how light behaves as it bounces off glass facades, how it filters through fire escapes, how it creates geometric patterns on concrete walls. The urban landscape is constantly changing, and with it, the quality and direction of light. What appears mundane in flat lighting can become extraordinary when the sun hits it just right.

<img src="/filler/DUO_1.0.jpeg" alt="Street scene" />

The key to successful urban photography lies in patience and observation. Sometimes you need to wait for the right moment when a person walks into your frame, when a cloud moves to reveal the sun, when the traffic light changes and creates a new color palette. These moments of serendipity are what make street photography so addictive and rewarding.`,
    images: ['/filler/DETAILS_1.0.jpeg', '/filler/DUO_1.0.jpeg']
  },
  {
    id: 2,
    title: 'The Art of Minimalism',
    subtitle: 'Less is more in visual storytelling',
    subtitlePosition: 'after',
    category: 'Composition',
    date: '2022-07-22',
    tags: ['minimalism', 'composition', 'simplicity', 'design'],
    coverImage: '',
    content: `Minimalism in photography is about stripping away the unnecessary to reveal the essential. It's a discipline that challenges photographers to find beauty in simplicity, to tell complete stories with fewer elements, and to create impact through restraint rather than abundance. The power of negative space, the elegance of clean lines, the poetry of a single subject against an uncluttered background.

<img src="/filler/DETAILS_1.1.jpeg" alt="Minimal composition" />

Creating minimalist photographs requires a different mindset. Instead of trying to include everything interesting in the frame, you must learn to exclude. Every element that remains must earn its place, must contribute to the overall message or feeling of the image. This process of elimination often reveals the true essence of your subject.

The challenge lies not in what to include, but in what to leave out. A single flower against a white wall can be more powerful than an entire garden. A lone figure on an empty beach can convey solitude more effectively than a crowd. The space around your subject becomes as important as the subject itself.

<img src="/filler/DETAILS_1.2.jpeg" alt="Clean lines" />

Minimalism also teaches us about the importance of light and shadow in their purest forms. Without the distraction of complex compositions, every subtle gradation of tone becomes significant. The way light falls across a simple surface, the gentle transition from highlight to shadow, the delicate interplay of textures – all of these elements gain prominence when given room to breathe.`,
    images: ['/filler/DETAILS_1.1.jpeg', '/filler/DETAILS_1.2.jpeg']
  },
  {
    id: 3,
    title: 'Portrait Sessions: Beyond the Surface',
    subtitle: 'Capturing authentic human connections',
    subtitlePosition: 'after',
    category: 'Portrait',
    date: '2022-11-08',
    tags: ['portrait', 'people', 'emotion', 'connection'],
    coverImage: '/filler/DUO_2.0.jpeg',
    content: `Every portrait session is a conversation without words, a dance between photographer and subject where trust and understanding gradually build. The camera becomes a bridge rather than a barrier, allowing genuine moments to emerge when both parties feel comfortable and connected. The best portraits happen when people forget they're being photographed.

<img src="/filler/DUO_2.1.jpeg" alt="Natural expression" />

The technical aspects of portrait photography – lighting, composition, focus – are just the foundation. The real art lies in creating an environment where authentic emotions can surface. This might mean talking about their passions, sharing a laugh, or simply giving them time to relax and be themselves. Some of the most powerful portraits capture people in quiet, unguarded moments.

Understanding your subject's personality is crucial. Some people are naturally expressive and animated, while others are more reserved and contemplative. A good portrait photographer adapts their approach to bring out the best in each individual. The shy person might shine in a more intimate, softly lit setting, while the extrovert might come alive with dramatic lighting and bold compositions.

<img src="/filler/DUO_2.2.jpeg" alt="Candid moment" />

The eyes truly are the windows to the soul in portrait photography. A sharp, well-lit eye can make or break a portrait. But it's not just about technical sharpness – it's about capturing that spark of life, that moment of connection between subject and viewer. Sometimes the most powerful portraits are those where the subject isn't looking directly at the camera, but their expression tells a complete story.`,
    images: ['/filler/DUO_2.1.jpeg', '/filler/DUO_2.2.jpeg']
  },
  {
    id: 4,
    title: 'Digital Workflow Mastery',
    subtitle: 'From capture to final edit',
    subtitlePosition: 'after',
    category: 'Post-Processing',
    date: '2023-01-14',
    tags: ['workflow', 'editing', 'digital', 'process'],
    coverImage: '',
    content: `A well-organized digital workflow is the backbone of professional photography. It's the difference between spending hours searching for files and having everything at your fingertips when inspiration strikes. The workflow begins before you even pick up the camera and continues long after the last image is delivered to the client.

<img src="/filler/DETAILS_1.3.jpeg" alt="Digital workspace" />

File organization might seem mundane, but it's crucial for long-term success. Developing a consistent naming convention, folder structure, and backup system saves countless hours and prevents the heartbreak of lost images. Every photographer needs to find a system that works for their specific needs and stick to it religiously.

The editing process is where good photographs become great ones. But it's important to remember that editing should enhance what's already there, not create something that wasn't. The goal is to realize the vision you had when you pressed the shutter, to bring out the mood and emotion that drew you to the scene in the first place.

<img src="/filler/DETAILS_1.4.jpeg" alt="Color grading" />

Color grading and tone mapping are powerful tools for creating mood and atmosphere. A warm, golden tone can make a portrait feel intimate and inviting, while cool blues might convey solitude or melancholy. Understanding how different colors affect emotion allows photographers to guide viewers' feelings and create more impactful images.

The key to effective post-processing is restraint. It's easy to get carried away with filters and effects, but the best edits are often the most subtle ones. The viewer should be drawn to the subject and story, not distracted by obvious processing. When editing is done well, it's invisible – it simply makes the photograph the best version of itself.`,
    images: ['/filler/DETAILS_1.3.jpeg', '/filler/DETAILS_1.4.jpeg']
  },

  // Set 2
  {
    id: 5,
    title: 'Golden Hour Magic',
    subtitle: 'Chasing the perfect light',
    subtitlePosition: 'after',
    category: 'Landscape',
    date: '2023-04-03',
    tags: ['golden hour', 'landscape', 'natural light', 'timing'],
    coverImage: '/filler/DUO_3.0.jpeg',
    content: `The golden hour – that magical time just after sunrise and before sunset when the light is soft, warm, and forgiving – is every photographer's favorite time of day. The harsh shadows of midday give way to gentle, even illumination that flatters every subject. Colors become richer, textures more pronounced, and the entire world seems to glow with an inner warmth.

<img src="/filler/DUO_3.1.jpeg" alt="Golden light landscape" />

Planning for golden hour photography requires dedication and preparation. You need to scout locations in advance, understand how the light will move across your scene, and be ready to work quickly when the conditions are perfect. The golden hour is brief – sometimes lasting only 20-30 minutes – so every moment counts.

The quality of light during golden hour is unmatched for portrait photography. The warm tones complement skin beautifully, and the low angle of the sun creates natural rim lighting that separates subjects from their backgrounds. Even amateur photographers can achieve professional-looking results when working with this forgiving light.

<img src="/filler/DUO_3.2.jpeg" alt="Portrait in golden light" />

Landscape photographers often plan entire trips around golden hour opportunities. The same mountain or coastline that looks ordinary in harsh midday sun can become breathtaking when bathed in the warm glow of early morning or late evening light. The interplay of light and shadow creates depth and dimension that transforms two-dimensional photographs into windows to another world.`,
    images: ['/filler/DUO_3.1.jpeg', '/filler/DUO_3.2.jpeg']
  },
  {
    id: 6,
    title: 'Street Food Chronicles',
    subtitle: 'Documenting culinary culture',
    subtitlePosition: 'after',
    category: 'Documentary',
    date: '2023-08-17',
    tags: ['food', 'culture', 'street', 'documentary'],
    coverImage: '',
    content: `Street food photography is about more than just making dishes look appetizing – it's about documenting culture, tradition, and the human stories behind every meal. Each vendor has a story, each recipe carries history, and every steaming bowl represents a connection between past and present. The challenge lies in capturing not just the food, but the entire experience.

<img src="/filler/DETAILS_1.5.jpeg" alt="Street vendor" />

The best street food photographs tell complete stories. They show the weathered hands preparing the meal, the concentration on the cook's face, the anticipation of waiting customers, and the satisfaction of the first bite. These environmental portraits capture the essence of place and culture in ways that simple food shots cannot.

Working in street food environments requires adaptability and respect. Vendors are often working in cramped spaces with limited time, so photographers must be unobtrusive while still capturing compelling images. Building relationships with vendors often leads to better access and more authentic moments.

<img src="/filler/DETAILS_1.6.jpeg" alt="Food preparation" />

The technical challenges of street food photography are significant. Mixed lighting from fluorescent bulbs, gas flames, and daylight creates complex color temperature issues. Steam and smoke can obscure subjects, while the fast pace of service means missing moments if you're not ready. Success requires both technical skill and cultural sensitivity.

Food photography in street settings also documents disappearing traditions. Many street food vendors are elderly artisans whose techniques have been passed down through generations. Photographing their work becomes a form of cultural preservation, capturing methods and recipes that might otherwise be lost to time.`,
    images: ['/filler/DETAILS_1.5.jpeg', '/filler/DETAILS_1.6.jpeg']
  },
  {
    id: 7,
    title: 'Architecture and Geometry',
    subtitle: 'Finding patterns in urban design',
    subtitlePosition: 'after',
    category: 'Architecture',
    date: '2023-12-05',
    tags: ['architecture', 'geometry', 'patterns', 'urban'],
    coverImage: '/filler/DUO_4.0.jpeg',
    content: `Architecture photography is about more than documenting buildings – it's about finding the poetry in concrete and steel, the rhythm in repetitive elements, and the human stories embedded in our built environment. Every structure reflects the values, technology, and aesthetic sensibilities of its time, making architectural photography a form of historical documentation.

<img src="/filler/DUO_4.1.jpeg" alt="Geometric patterns" />

The interplay of light and shadow on architectural surfaces creates endless opportunities for abstract compositions. A simple office building can become a study in geometric patterns when photographed from the right angle at the right time of day. The key is learning to see beyond the building's function to its visual potential.

Modern architecture often emphasizes clean lines and geometric forms that translate beautifully to photography. Glass facades reflect the sky and surrounding buildings, creating layered compositions that blur the line between reality and reflection. These reflective surfaces can turn a single building into a complex visual puzzle.

<img src="/filler/DUO_4.2.jpeg" alt="Architectural details" />

Detail photography in architecture reveals the craftsmanship and thought that goes into every element of a building's design. From the texture of weathered brick to the precision of modern steel joints, these details tell stories about construction techniques, material choices, and the passage of time. Sometimes the most compelling architectural photographs focus on these small elements rather than grand vistas.

The challenge in architectural photography is balancing accurate documentation with artistic interpretation. While it's important to represent buildings faithfully, the most memorable architectural photographs often emphasize mood, atmosphere, and emotional response over literal representation.`,
    images: ['/filler/DUO_4.1.jpeg', '/filler/DUO_4.2.jpeg']
  },
  {
    id: 8,
    title: 'Night Photography Adventures',
    subtitle: 'When darkness reveals new worlds',
    subtitlePosition: 'after',
    category: 'Night Photography',
    date: '2024-02-28',
    tags: ['night', 'long exposure', 'city lights', 'stars'],
    coverImage: '',
    content: `Night photography opens up a completely different world of creative possibilities. When the sun sets, artificial lights create new color palettes, long exposures reveal motion invisible to the naked eye, and the familiar becomes mysterious and dramatic. The technical challenges are significant, but the rewards are extraordinary.

<img src="/filler/DUO_5.0.jpeg" alt="City lights at night" />

Urban night photography transforms cities into rivers of light. Car headlights become flowing streams of red and white, neon signs paint buildings in electric colors, and windows in skyscrapers create patterns of illuminated geometry. The key is learning to work with available light sources and understanding how different types of artificial lighting affect color temperature.

Long exposure techniques are essential for night photography. They allow photographers to capture star trails, smooth water surfaces, and the movement of clouds across the night sky. But long exposures also require patience, planning, and a solid understanding of camera settings. A single image might require several minutes of exposure time.

<img src="/filler/DUO_5.1.jpeg" alt="Star trails" />

Safety is a crucial consideration in night photography. Scouting locations during daylight, bringing appropriate lighting equipment, and informing others of your plans are all important precautions. Many of the best night photography locations are remote or potentially hazardous in darkness.

The post-processing workflow for night photography often involves noise reduction, careful color balancing, and sometimes focus stacking to ensure sharp images throughout the frame. The extreme conditions of night photography push camera sensors to their limits, requiring specialized techniques to achieve clean, professional results.`,
    images: ['/filler/DUO_5.0.jpeg', '/filler/DUO_5.1.jpeg']
  },

  // Set 3
  {
    id: 9,
    title: 'Macro World Discoveries',
    subtitle: 'Exploring the universe in miniature',
    subtitlePosition: 'after',
    category: 'Macro',
    date: '2024-05-12',
    tags: ['macro', 'close-up', 'nature', 'details'],
    coverImage: '/filler/DETAILS_2.0.jpeg',
    content: `Macro photography reveals worlds within worlds, showing us details that exist all around us but remain invisible to casual observation. A dewdrop becomes a crystal sphere, an insect's eye transforms into a geometric marvel, and flower petals reveal textures as complex as any landscape. This intimate form of photography requires patience, precision, and a willingness to slow down and truly observe.

<img src="/filler/DETAILS_2.1.jpeg" alt="Water droplet macro" />

The technical challenges of macro photography are unique. Depth of field becomes extremely shallow at high magnifications, often measuring in millimeters rather than feet. This means that focus must be absolutely precise, and often focus stacking techniques are necessary to achieve sharp images throughout the subject. Even the slightest camera movement can ruin a shot.

Lighting in macro photography requires special consideration. The close working distances mean that the camera and lens often block natural light from reaching the subject. Ring flashes, LED panels, and reflectors become essential tools for creating even, flattering illumination. Understanding how light behaves at such close distances is crucial for success.

<img src="/filler/DETAILS_2.2.jpeg" alt="Insect close-up" />

The natural world provides endless subjects for macro photography. From the intricate patterns on butterfly wings to the alien landscapes of tree bark, every surface reveals new details when examined closely. Garden flowers, insects, leaves, and even household objects can become fascinating subjects when viewed through a macro lens.

Macro photography also teaches patience and observation skills that benefit all forms of photography. Learning to see the extraordinary in the ordinary, to notice subtle details and patterns, and to work methodically under challenging conditions are skills that translate to every genre of photography.`,
    images: ['/filler/DETAILS_2.1.jpeg', '/filler/DETAILS_2.2.jpeg']
  },
  {
    id: 10,
    title: 'Travel Photography Ethics',
    subtitle: 'Responsible storytelling across cultures',
    subtitlePosition: 'after',
    category: 'Travel',
    date: '2024-09-07',
    tags: ['travel', 'ethics', 'culture', 'responsibility'],
    coverImage: '',
    content: `Travel photography carries unique responsibilities. When we point our cameras at people, places, and cultures different from our own, we become storytellers with the power to shape perceptions and influence understanding. This privilege comes with the obligation to represent our subjects with dignity, accuracy, and respect.

<img src="/filler/DUO_6.0.jpeg" alt="Cultural interaction" />

The relationship between photographer and subject becomes more complex when cultural and economic differences are involved. What might seem like a harmless tourist photo could have significant implications for the people being photographed. Understanding local customs, asking permission when appropriate, and considering the long-term impact of our images are all crucial considerations.

Avoiding stereotypes and clichés in travel photography requires conscious effort and cultural sensitivity. It's easy to fall into the trap of photographing only the exotic or unusual, creating a distorted view of places and people. The most honest travel photography shows the full spectrum of life – the ordinary alongside the extraordinary, the modern alongside the traditional.

<img src="/filler/DUO_6.1.jpeg" alt="Daily life scene" />

Economic considerations also play a role in ethical travel photography. In many destinations, photography can become a source of income for local people, but it can also lead to exploitation if not handled thoughtfully. Understanding the economic dynamics of the places we visit helps us make more responsible choices about how we practice our craft.

The goal of ethical travel photography should be to create images that honor the dignity of our subjects while telling authentic stories about the places we visit. This means taking time to understand context, building genuine relationships when possible, and always considering how our work might affect the communities we photograph.`,
    images: ['/filler/DUO_6.0.jpeg', '/filler/DUO_6.1.jpeg']
  },
  {
    id: 11,
    title: 'Black and White Mastery',
    subtitle: 'The timeless art of monochrome',
    subtitlePosition: 'after',
    category: 'Black and White',
    date: '2025-01-19',
    tags: ['black and white', 'monochrome', 'contrast', 'timeless'],
    coverImage: '/filler/BTC_2.0.jpeg',
    content: `Black and white photography strips away the distraction of color to reveal the essential elements of composition, light, and emotion. Without the immediate impact of color, viewers are drawn to texture, form, contrast, and the subtle interplay of tones that create mood and atmosphere. Mastering monochrome photography requires learning to see the world in terms of light and shadow rather than hue and saturation.

<img src="/filler/DETAILS_1.7.jpeg" alt="High contrast scene" />

The decision to shoot in black and white should be intentional, not arbitrary. Some subjects naturally lend themselves to monochrome treatment – dramatic skies, architectural details, portraits with strong emotional content, or scenes where color might be distracting from the main message. Learning to recognize these opportunities is key to successful black and white photography.

Contrast becomes the primary tool for creating visual impact in monochrome images. This doesn't just mean the difference between black and white, but the full range of tones from deep shadows to bright highlights. Understanding how to use contrast to direct attention, create depth, and establish mood is essential for compelling black and white photography.

<img src="/filler/DETAILS_1.8.jpeg" alt="Tonal range" />

The post-processing workflow for black and white photography offers tremendous creative control. Different color channels can be adjusted to create dramatically different monochrome interpretations of the same image. A red filter effect might darken skies and emphasize clouds, while a yellow filter might brighten skin tones in portraits. These digital tools give photographers the same control that film photographers achieved with colored filters.

Black and white photography has a timeless quality that transcends trends and fashions. Images created decades ago can still feel contemporary and relevant when executed well. This enduring appeal makes monochrome photography particularly suitable for fine art, documentary work, and any situation where the goal is to create images with lasting impact.`,
    images: ['/filler/DETAILS_1.7.jpeg', '/filler/DETAILS_1.8.jpeg']
  },
  {
    id: 12,
    title: 'Weather Photography Challenges',
    subtitle: 'Capturing nature\'s dramatic moments',
    subtitlePosition: 'after',
    category: 'Weather',
    date: '2025-06-11',
    tags: ['weather', 'storms', 'nature', 'dramatic'],
    coverImage: '',
    content: `Weather photography puts photographers in direct contact with nature's most dramatic and unpredictable moments. From towering thunderstorms to gentle morning mist, weather conditions create opportunities for extraordinary images while presenting significant technical and safety challenges. Success requires preparation, patience, and respect for the power of natural forces.

<img src="/filler/DUO_3.3.jpeg" alt="Storm clouds" />

Storm photography is perhaps the most challenging and rewarding form of weather photography. Capturing lightning requires precise timing, proper safety precautions, and often hours of waiting for the right moment. The dramatic interplay of light and shadow in storm clouds creates natural compositions that are impossible to replicate in any other conditions.

Equipment protection becomes crucial when photographing in adverse weather conditions. Rain, snow, sand, and extreme temperatures can damage cameras and lenses if proper precautions aren't taken. Weather sealing, protective covers, and backup equipment are essential for photographers who regularly work in challenging conditions.

<img src="/filler/DUO_3.4.jpeg" alt="Misty landscape" />

Fog and mist create ethereal conditions that transform familiar landscapes into mysterious, dreamlike scenes. These conditions require different exposure techniques and often benefit from slight overexposure to maintain the bright, airy feeling of the mist. The key is learning to work quickly, as fog conditions can change rapidly.

Safety must always be the primary consideration in weather photography. Lightning, flash floods, extreme cold, and high winds all pose serious risks to photographers. Understanding weather patterns, having emergency plans, and knowing when to retreat are as important as any technical skills. No photograph is worth risking personal safety.`,
    images: ['/filler/DUO_3.3.jpeg', '/filler/DUO_3.4.jpeg']
  },

  // Set 4
  {
    id: 13,
    title: 'Wildlife Photography Patience',
    subtitle: 'Waiting for the perfect moment',
    subtitlePosition: 'after',
    category: 'Wildlife',
    date: '2025-10-23',
    tags: ['wildlife', 'patience', 'nature', 'animals'],
    coverImage: '/filler/DUO_1.3.jpeg',
    content: `Wildlife photography is the ultimate test of patience, preparation, and perseverance. Unlike human subjects who can be directed and posed, wild animals operate on their own schedules and follow their own instincts. Success often requires hours of waiting, careful observation of animal behavior, and the ability to react quickly when the perfect moment finally arrives.

<img src="/filler/DUO_1.4.jpeg" alt="Bird in flight" />

Understanding animal behavior is as important as mastering camera techniques in wildlife photography. Knowing when animals are most active, where they're likely to appear, and how they react to human presence can make the difference between returning home with empty memory cards or portfolio-worthy images. This knowledge comes from research, observation, and often years of experience in the field.

The technical demands of wildlife photography are significant. Long telephoto lenses are often necessary to maintain safe distances while filling the frame with distant subjects. These lenses require fast shutter speeds to avoid camera shake, which in turn demands high ISO settings and careful attention to exposure. The combination of challenging lighting conditions and moving subjects pushes both equipment and photographer skills to their limits.

<img src="/filler/DUO_1.5.jpeg" alt="Animal portrait" />

Ethical considerations are paramount in wildlife photography. The welfare of the animals must always take precedence over getting the shot. This means maintaining appropriate distances, avoiding disruption of natural behaviors, and never using techniques that might stress or endanger wildlife. The best wildlife photographers are also conservationists who use their images to promote understanding and protection of natural habitats.

The rewards of wildlife photography extend far beyond the images themselves. Spending time in natural environments, observing animal behavior, and developing a deeper connection with the natural world enriches the photographer's life in ways that go beyond the technical aspects of the craft. These experiences often inspire a lifelong commitment to conservation and environmental awareness.`,
    images: ['/filler/DUO_1.4.jpeg', '/filler/DUO_1.5.jpeg']
  },
  {
    id: 14,
    title: 'Concert Photography Energy',
    subtitle: 'Capturing live music moments',
    subtitlePosition: 'after',
    category: 'Concert',
    date: '2026-01-08',
    tags: ['concert', 'music', 'live', 'energy'],
    coverImage: '',
    content: `Concert photography is about capturing the energy, emotion, and spectacle of live music performance. Working in challenging lighting conditions with constantly moving subjects, concert photographers must be technically proficient while remaining invisible to both performers and audience. The goal is to freeze moments that convey the power and passion of live music.

<img src="/filler/BTC_1.8.jpeg" alt="Stage lighting" />

The technical challenges of concert photography are formidable. Stage lighting changes constantly, often shifting from bright spotlights to near darkness within seconds. High ISO performance becomes crucial, as does the ability to work with available light rather than flash, which is typically prohibited at professional venues. Understanding how different types of stage lighting affect exposure and color balance is essential.

Timing is everything in concert photography. The best images often capture peak moments of performance – the guitarist's solo, the singer's emotional delivery, the drummer's powerful strike. These moments require anticipation and quick reflexes, as they often last only seconds. Successful concert photographers learn to read performers and anticipate these climactic moments.

<img src="/filler/BTC_1.9.jpeg" alt="Performer in action" />

Access and positioning are crucial factors in concert photography. Professional photographers often have limited time slots and restricted areas from which to shoot. Making the most of these constraints requires careful planning, knowledge of the venue, and the ability to work efficiently under pressure. Every shot must count when time and access are limited.

The relationship between photographer and performer can significantly impact the quality of images. Musicians who are comfortable with photographers often give more natural, expressive performances. Building trust and maintaining professionalism helps create an environment where authentic moments can be captured without disrupting the artistic process.`,
    images: ['/filler/BTC_1.8.jpeg', '/filler/BTC_1.9.jpeg']
  },
  {
    id: 15,
    title: 'Fashion Photography Collaboration',
    subtitle: 'Creating visual narratives with style',
    subtitlePosition: 'after',
    category: 'Fashion',
    date: '2026-04-15',
    tags: ['fashion', 'collaboration', 'style', 'creative'],
    coverImage: '/filler/DUO_2.3.jpeg',
    content: `Fashion photography is fundamentally collaborative, bringing together photographers, models, stylists, makeup artists, and designers to create images that are greater than the sum of their parts. Success depends not just on technical skill, but on the ability to communicate vision, direct teams, and synthesize multiple creative inputs into cohesive visual narratives.

<img src="/filler/DUO_2.4.jpeg" alt="Fashion shoot setup" />

The pre-production phase of fashion photography is as important as the actual shoot. Mood boards, location scouting, wardrobe selection, and team coordination all contribute to the final result. A clear vision communicated effectively to all team members ensures that everyone is working toward the same creative goals. This preparation phase often determines the success or failure of the entire project.

Lighting in fashion photography serves multiple purposes beyond simple illumination. It must flatter the model, showcase the clothing's texture and details, and support the overall mood and concept of the shoot. Whether using natural light for an organic feel or elaborate studio setups for dramatic effect, lighting choices are fundamental to the image's impact and commercial success.

<img src="/filler/DUO_2.5.jpeg" alt="Model posing" />

Direction and communication skills are crucial in fashion photography. Models need clear guidance to achieve the desired poses and expressions, while the entire team needs to understand how their contributions fit into the larger vision. The photographer often serves as both creative director and technical expert, balancing artistic vision with practical execution.

Post-production in fashion photography often involves extensive retouching to achieve the polished look expected in commercial work. This might include skin retouching, color correction, background replacement, and detail enhancement. However, the goal should always be to enhance rather than completely alter reality, maintaining authenticity while achieving commercial standards.`,
    images: ['/filler/DUO_2.4.jpeg', '/filler/DUO_2.5.jpeg']
  },
  {
    id: 16,
    title: 'Documentary Storytelling',
    subtitle: 'Truth through the lens',
    subtitlePosition: 'after',
    category: 'Documentary',
    date: '2026-08-30',
    tags: ['documentary', 'storytelling', 'truth', 'social'],
    coverImage: '',
    content: `Documentary photography carries the responsibility of truthful storytelling, using images to illuminate social issues, preserve historical moments, and give voice to those who might otherwise go unheard. Unlike other forms of photography that prioritize aesthetics or commercial appeal, documentary work must balance visual impact with journalistic integrity and ethical responsibility.

<img src="/filler/DETAILS_1.9.jpeg" alt="Social documentary scene" />

The relationship between documentary photographer and subject is complex and requires careful navigation. Building trust while maintaining objectivity, gaining access while respecting privacy, and telling complete stories while avoiding exploitation are ongoing challenges. The best documentary photographers develop long-term relationships with their subjects, allowing for deeper, more nuanced storytelling.

Technical considerations in documentary photography often take a backseat to content and access. The ability to work quickly and unobtrusively with minimal equipment is often more valuable than perfect technical execution. Available light, candid moments, and authentic expressions are typically more important than controlled lighting or posed compositions.

<img src="/filler/DETAILS_2.0.jpeg" alt="Candid moment" />

Ethical considerations are paramount in documentary work. Questions of consent, representation, and the potential impact of publication must be carefully considered. Documentary photographers have the power to shape public perception and influence policy, making ethical decision-making a crucial skill alongside technical proficiency.

The long-term impact of documentary photography extends far beyond individual images. Bodies of work can raise awareness, influence social change, and preserve important historical records. This potential for meaningful impact is what draws many photographers to documentary work, despite its challenges and often limited commercial rewards.`,
    images: ['/filler/DETAILS_1.9.jpeg', '/filler/DETAILS_2.0.jpeg']
  },

  // Set 5
  {
    id: 17,
    title: 'Aerial Perspectives',
    subtitle: 'The world from above',
    subtitlePosition: 'after',
    category: 'Aerial',
    date: '2022-05-27',
    tags: ['aerial', 'drone', 'perspective', 'landscape'],
    coverImage: '/filler/DUO_5.2.jpeg',
    content: `Aerial photography has been revolutionized by drone technology, making bird's-eye perspectives accessible to photographers who previously would have needed helicopters or planes. This new vantage point reveals patterns, relationships, and compositions that are invisible from ground level, opening up entirely new creative possibilities for landscape and architectural photography.

<img src="/filler/DUO_5.3.jpeg" alt="Aerial landscape" />

The technical challenges of aerial photography are unique. Wind conditions, battery life, and regulatory restrictions all impact shooting opportunities. Understanding weather patterns, flight regulations, and safety procedures is as important as mastering camera settings. The remote nature of drone operation also requires different compositional skills, as photographers must frame shots through a small screen rather than direct observation.

Composition in aerial photography often emphasizes patterns, textures, and geometric relationships that aren't apparent from ground level. Agricultural fields become abstract art, urban developments reveal their underlying structure, and natural formations display their geological history. Learning to see these patterns and translate them into compelling compositions is key to successful aerial photography.

<img src="/filler/DUO_5.4.jpeg" alt="Urban aerial view" />

Legal and ethical considerations are crucial in aerial photography. Drone regulations vary by location and are constantly evolving, requiring photographers to stay informed about current rules and restrictions. Privacy concerns, safety considerations, and environmental impact must all be factored into flight planning and execution.

The post-processing workflow for aerial photography often involves correcting for atmospheric haze, adjusting for unusual lighting conditions, and sometimes stitching multiple images together for panoramic views. The unique perspective of aerial photography also offers opportunities for creative processing techniques that emphasize the abstract qualities of the elevated viewpoint.`,
    images: ['/filler/DUO_5.3.jpeg', '/filler/DUO_5.4.jpeg']
  },
  {
    id: 18,
    title: 'Food Photography Styling',
    subtitle: 'Making meals irresistible',
    subtitlePosition: 'after',
    category: 'Food',
    date: '2022-09-14',
    tags: ['food', 'styling', 'commercial', 'appetizing'],
    coverImage: '',
    content: `Food photography is about more than just documenting meals – it's about creating desire, telling stories, and making viewers hungry through visual appeal alone. Success requires understanding not just photography techniques, but also food styling, prop selection, and the psychology of appetite. Every element in the frame must work together to create an irresistible image.

<img src="/filler/DETAILS_2.1.jpeg" alt="Food styling setup" />

Lighting is crucial in food photography, as it affects both the visual appeal and the apparent freshness of the food. Natural light is often preferred for its soft, even quality, but artificial lighting allows for more control and consistency. Understanding how different lighting setups affect texture, color, and mood helps create images that make food look as delicious as possible.

Food styling is an art form in itself, requiring knowledge of how different foods behave under lights and over time. Some ingredients photograph better when slightly undercooked, others need special treatments to maintain their appearance during long photo sessions. Professional food stylists use various tricks and substitutions to ensure food looks perfect for the camera.

<img src="/filler/DETAILS_2.2.jpeg" alt="Plated dish" />

Composition in food photography must balance visual appeal with practical considerations. The angle of view, depth of field, and prop selection all contribute to the story being told. A rustic, overhead shot might work for a casual recipe blog, while an elegant, low-angle composition might be better for fine dining marketing materials.

The commercial applications of food photography are vast, from restaurant menus and cookbook illustrations to social media marketing and advertising campaigns. Understanding the intended use of images helps guide creative decisions and ensures that the final photographs serve their commercial purpose while maintaining artistic quality.`,
    images: ['/filler/DETAILS_2.1.jpeg', '/filler/DETAILS_2.2.jpeg']
  },
  {
    id: 19,
    title: 'Sports Photography Action',
    subtitle: 'Freezing moments of athletic excellence',
    subtitlePosition: 'after',
    category: 'Sports',
    date: '2023-02-11',
    tags: ['sports', 'action', 'athletics', 'motion'],
    coverImage: '/filler/BTC_1.7.jpeg',
    content: `Sports photography demands split-second timing, technical precision, and deep understanding of athletic competition. The goal is to capture peak moments of action, emotion, and achievement that tell the complete story of athletic performance. Success requires not just fast reflexes, but anticipation, positioning, and the ability to work under intense pressure.

<img src="/filler/BTC_1.8.jpeg" alt="Athletic action" />

Understanding the sport being photographed is crucial for anticipating key moments and positioning for optimal shots. Each sport has its rhythms, critical moments, and visual opportunities. A basketball photographer needs to know when players are likely to drive to the basket, while a football photographer must anticipate the snap count and play development.

The technical demands of sports photography push equipment to its limits. Fast autofocus, high frame rates, and excellent high-ISO performance are essential for capturing sharp images of rapidly moving subjects in varying light conditions. Long telephoto lenses are often necessary to fill the frame from the sidelines or stands.

<img src="/filler/BTC_1.9.jpeg" alt="Victory moment" />

Emotion is as important as action in sports photography. The joy of victory, the agony of defeat, the intensity of competition, and the camaraderie of teammates all provide opportunities for powerful images. These emotional moments often occur between plays or after the action has stopped, requiring photographers to remain alert throughout the entire event.

Access and positioning are critical factors in sports photography. Professional photographers often have sideline access that allows for dramatic angles and close-up shots impossible from the stands. However, this access comes with responsibilities to remain unobtrusive and safe while capturing the action. Understanding venue rules and maintaining professional relationships with event organizers is essential for continued access.`,
    images: ['/filler/BTC_1.8.jpeg', '/filler/BTC_1.9.jpeg']
  },
  {
    id: 20,
    title: 'Fine Art Photography Vision',
    subtitle: 'Personal expression through imagery',
    subtitlePosition: 'after',
    category: 'Fine Art',
    date: '2023-06-18',
    tags: ['fine art', 'vision', 'expression', 'creative'],
    coverImage: '',
    content: `Fine art photography transcends documentation to become personal expression, using the camera as a tool for creative vision rather than mere recording. Unlike commercial or journalistic photography, fine art work is driven by the photographer's inner vision and artistic goals rather than external requirements or client needs. This freedom brings both opportunities and challenges.

<img src="/filler/DUO_6.2.jpeg" alt="Artistic composition" />

Developing a personal vision in fine art photography requires introspection, experimentation, and often years of exploration. What themes, subjects, or techniques resonate with your personal experience and worldview? How can photographic techniques be used to express ideas, emotions, or concepts that go beyond literal representation? These questions guide the development of a unique artistic voice.

Technical mastery becomes a means to an end in fine art photography rather than an end in itself. While solid technical skills are essential, they serve the larger goal of artistic expression. This might mean deliberately breaking conventional rules, using alternative processes, or pushing techniques to their limits to achieve specific artistic effects.

<img src="/filler/DUO_6.3.jpeg" alt="Abstract interpretation" />

The presentation and context of fine art photography are as important as the images themselves. Gallery exhibitions, artist statements, and the sequence of images all contribute to how the work is perceived and understood. Fine art photographers must consider not just individual images, but how bodies of work communicate larger themes and ideas.

The market for fine art photography operates differently from commercial photography, with considerations of limited editions, gallery representation, and collector interest. However, the primary motivation should always be artistic integrity and personal expression rather than commercial success. The most successful fine art photographers are those who remain true to their vision while finding ways to share that vision with others.`,
    images: ['/filler/DUO_6.2.jpeg', '/filler/DUO_6.3.jpeg']
  }
]

export const getBlogPosts = (): BlogPost[] => {
  if (typeof window === 'undefined') {
    return defaultPosts
  }
  
  try {
    const savedPosts = localStorage.getItem('blogPosts')
    if (savedPosts) {
      const parsed = JSON.parse(savedPosts)
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultPosts
    }
  } catch (error) {
    console.error('Error loading blog posts:', error)
  }
  
  return defaultPosts
}

export const saveBlogPosts = (posts: BlogPost[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('blogPosts', JSON.stringify(posts))
  }
}

// Migration function to move legacy data to new database system
export const migrateLegacyDataToDatabase = async (): Promise<{
  success: boolean
  migratedCount: number
  errors: string[]
}> => {
  const errors: string[] = []
  let migratedCount = 0
  
  try {
    // Get existing database posts to avoid duplicates
    const existingResponse = await dataService.getBlogPosts({ limit: 1000 })
    const existingIds = new Set(
      existingResponse.success && existingResponse.data 
        ? existingResponse.data.map(post => post.id)
        : []
    )
    
    // Get legacy posts
    const legacyPosts = getBlogPosts()
    
    for (const legacyPost of legacyPosts) {
      // Skip if already exists in database
      if (existingIds.has(legacyPost.id)) {
        continue
      }
      
      try {
        const dbPost: Omit<DBBlogPost, 'id' | 'createdAt' | 'updatedAt'> = {
          title: legacyPost.title,
          subtitle: legacyPost.subtitle,
          subtitlePosition: legacyPost.subtitlePosition,
          content: legacyPost.content,
          category: legacyPost.category,
          tags: legacyPost.tags,
          coverImage: legacyPost.coverImage,
          publishedAt: legacyPost.date + 'T00:00:00.000Z',
          images: legacyPost.images.map((url, index) => ({
            id: index + 1,
            url,
            alt: `Image ${index + 1}`,
            position: index + 1
          })),
          status: 'published',
          author: 'Admin',
          isActive: true,
          viewCount: 0,
          likes: 0,
          seo: {
            keywords: legacyPost.tags,
            metaTitle: legacyPost.title,
            metaDescription: legacyPost.subtitle || legacyPost.title
          }
        }
        
        const response = await dataService.createBlogPost(dbPost)
        if (response.success) {
          migratedCount++
        } else {
          errors.push(`Failed to migrate post "${legacyPost.title}": ${response.error}`)
        }
      } catch (error) {
        errors.push(`Error migrating post "${legacyPost.title}": ${error}`)
      }
    }
    
    return {
      success: true,
      migratedCount,
      errors
    }
  } catch (error) {
    return {
      success: false,
      migratedCount,
      errors: [...errors, `Migration failed: ${error}`]
    }
  }
}

// Convert admin post format to blog post format
export const convertToBlogFormat = (adminPost: BlogPost) => {
  return {
    id: adminPost.id,
    title: adminPost.title,
    subtitle: adminPost.subtitle,
    content: adminPost.content,
    image: adminPost.coverImage || null,
    date: adminPost.date,
    category: adminPost.category,
    tags: adminPost.tags || []
  }
}