import type { Lesson } from '../types/index.ts'

function beginner(id: string, title: string, letters: string): Lesson {
  return {
    id: `beginner-${id}`,
    levelId: 'beginner',
    title,
    prompts: [...letters],
    matchCase: false,
  }
}

function words(id: string, title: string, prompts: readonly string[]): Lesson {
  return {
    id: `intermediate-${id}`,
    levelId: 'intermediate',
    title,
    prompts,
    matchCase: false,
  }
}

function sentences(
  id: string,
  title: string,
  prompts: readonly string[],
  matchCase: boolean,
): Lesson {
  return {
    id: `expert-${id}`,
    levelId: 'expert',
    title,
    prompts,
    matchCase,
  }
}

const beginnerLessons: readonly Lesson[] = [
  beginner('a', 'The A key', 'AAAA'),
  beginner('s', 'The S key', 'SSSS'),
  beginner('as', 'A and S', 'ASASSA'),
  beginner('df', 'D and F', 'DDFFDF'),
  beginner('jk', 'J and K', 'JJKKJK'),
  beginner('l', 'The L key', 'LLLKLK'),
  beginner('gh', 'G and H', 'GHGHGH'),
  beginner('home', 'The home row', 'ASDFGHJKLFJDK'),
  beginner('qwe', 'Q, W, and E', 'QWEQWE'),
  beginner('rty', 'R, T, and Y', 'RTYRTY'),
  beginner('uiop', 'U, I, O, and P', 'UIOPUI'),
  beginner('zxc', 'Z, X, and C', 'ZXCZXC'),
  beginner('vbnm', 'V, B, N, and M', 'VBNMVB'),
  beginner('mix', 'Mix the letters', 'AQLZPMWSK'),
]

const wordLessons: readonly Lesson[] = [
  words('pets', 'Cat and dog', ['cat', 'dog', 'sun', 'cat']),
  words('hat', 'Hat and pig', ['hat', 'pig', 'cup']),
  words('bus', 'Bus and red', ['bus', 'red', 'big']),
  words('jump', 'Jump and frog', ['jump', 'frog', 'fish']),
  words('book', 'Book and tree', ['book', 'tree', 'bird']),
  words('apple', 'Apple and water', ['apple', 'water', 'happy']),
  words('mix', 'Mix the words', ['sun', 'jump', 'book', 'fish']),
  words('garden', 'Garden words', ['garden', 'rabbit', 'yellow', 'window', 'flower']),
  words('school', 'School words', ['school', 'friend', 'pencil', 'orange', 'purple']),
  words('longer', 'Longer words', ['elephant', 'birthday', 'rainbow', 'sandwich', 'butterfly']),
  words('tricky', 'Tricky words', ['squirrel', 'tomorrow', 'beautiful', 'adventure', 'umbrella']),
]

const sentenceLessons: readonly Lesson[] = [
  sentences('line', 'A short line', ['a cat sat.', 'the dog ran.'], false),
  sentences('more', 'One more line', ['the sun is big.', 'a frog can jump.'], false),
  sentences('capitals', 'Capital letters', ['The cat sat.', 'A dog ran.'], true),
  sentences('longer', 'A longer line', ['The bird is in the tree.'], true),
  sentences('question', 'A question', ['Can a cat run?', 'Is the sun big?'], true),
  sentences('comma', 'A comma', ['I see a cat, a dog and a hen.'], true),
  sentences('apostrophe', 'An apostrophe', ["It's a red ball.", "The cat's hat is big."], true),
  sentences('full', 'A full sentence', ['The small cat sat on a mat.'], true),
  sentences(
    'story',
    'A short story',
    [
      'The red fox sat by the pond and watched the ducks swim past.',
      'Then the fox ran home to the warm den.',
    ],
    true,
  ),
  sentences(
    'weather',
    'Weather',
    [
      'Is the sky blue today, or is it full of grey clouds?',
      'Bring a coat if the rain starts.',
    ],
    true,
  ),
  sentences(
    'party',
    'The party',
    ["Sam's cake is big, and Mia's hat is red.", 'Can we sing before we eat?'],
    true,
  ),
  sentences(
    'walk',
    'After school',
    [
      'After school I walk past the bakery, the park, and the little library.',
      "It's a long walk, but I like it.",
    ],
    true,
  ),
]

function paragraph(id: string, title: string, text: string): Lesson {
  return {
    id: `master-${id}`,
    levelId: 'master',
    title,
    prompts: [text],
    matchCase: true,
  }
}

const masterLessons: readonly Lesson[] = [
  paragraph(
    'park',
    'The quiet park',
    'On Saturday morning, the park is bright and quiet. A brown dog runs along the path, and a duck floats on the pond. Two children sit on a red bench and share a green apple. The sun feels warm, and the grass smells sweet after the rain. A small bird sings in the tall tree beside the wooden gate. Can you hear that song? I like this park because the air is calm, the flowers are yellow, and nobody is in a hurry. When the bell on the ice cream cart rings, we walk over and choose a cold treat.',
  ),
  paragraph(
    'library',
    'The rainy library',
    "The town library is my favorite room on a rainy day. Tall shelves hold books about ships, horses, and the moon. I choose a story, find a soft chair by the window, and read until the pages feel warm. Ms. Patel smiles and stamps my card. It's quiet, except for the rain and a clock that ticks above the door. Can a book take you somewhere new? I think it can. When the rain stops, I walk home with the book under my coat so the pages stay dry.",
  ),
  paragraph(
    'farm',
    'The farm trip',
    "Our class went to the farm on Friday, and the bus ride felt very long. We saw sheep, a muddy pig, and a goat that tried to eat Sam's hat. The farmer let us hold a tiny chick that was soft and yellow. I wrote their names in my notebook so I would not forget them. After lunch, we washed our hands and sat under a tree. Was the chick the best part? I think so. On the way back, everybody talked at once, and the teacher laughed.",
  ),
  paragraph(
    'birthday',
    "Mia's birthday",
    "Today is Mia's birthday, and the kitchen smells like warm cake. Her friends bring a red balloon, a paper crown, and a card with a drawing of a cat. We sing, and then Mia blows out the candles in one big breath. It's her wish, so nobody asks what she wished for. After the song, we eat cake with strawberries on top. Can you pass the plates? There is enough for every person at the table. When the party ends, we help wash the cups and fold the paper hats.",
  ),
]

export const LESSONS: readonly Lesson[] = [
  ...beginnerLessons,
  ...wordLessons,
  ...sentenceLessons,
  ...masterLessons,
]
