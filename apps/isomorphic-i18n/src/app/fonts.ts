import { Inter, Lexend_Deca ,Almarai, El_Messiri, Tajawal } from 'next/font/google';

// export const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

// export const lexendDeca = Lexend_Deca({
//   subsets: ['latin'],
//   variable: '--font-lexend',
// });
// export const almarai = Almarai({
//   weight: ['300', '400', '700', '800'], 
//   subsets: ['arabic'], 
//   variable: '--font-almarai', 
//   preload: true,
//   fallback: ['Arial', 'sans-serif'], 
// });

export const elTajawal = Tajawal({
  weight: ['400', '500', '700', '800'], 
  subsets: ['arabic'], 
  variable: '--font-el-tajawal', 
  preload: true,
  fallback: ['Arial', 'sans-serif'], 
});


export const elMessiri = El_Messiri({
  weight: ['400', '500', '600', '700'], 
  subsets: ['arabic'],
  variable: '--font-el-messiri',
  preload: true,
  fallback: ['Arial', 'sans-serif'], 
});


