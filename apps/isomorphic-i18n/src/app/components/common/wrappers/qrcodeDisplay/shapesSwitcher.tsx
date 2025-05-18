import { Transition } from '@headlessui/react';
import { useContext } from 'react';
import { Button } from './details';
import { QrStyleContext } from '@/app/components/contsxt1';

const ShapesSwitcher = ({lang}:{lang:string}) => {
  const { state, dispatch } = useContext(QrStyleContext);
  return (
    <>
      <div className={'flex flex-wrap justify-center'}>
        <Button
        lang={lang}
          title={lang==='ar'?'مربعات' :'Squares'}
          active={state.style === 'square'}
          onClick={() =>
            dispatch({
              type: 'SET_QR_STYLE',
              payload: { style: 'square', dotType: 'square' },
            })
          }
        />
        <Button
        lang={lang}
          title={lang==='ar'?'نقاط' :'Dots'}
          active={state.style === 'dot'}
          onClick={() =>
            dispatch({
              type: 'SET_QR_STYLE',
              payload: { style: 'dot' },
            })
          }
        />
      </div>
      {state.style === 'dot' && (
        <Transition
          enter={'transition duration-100 ease-out'}
          enterFrom={'transform -translate-y-1/2 opacity-0'}
          enterTo={'transform translate-y-0 opacity-100'}
          leave={'transition duration-75 ease-out'}
          leaveFrom={'transform translate-y-0 opacity-100'}
          leaveTo={'transform -translate-y-1/2 opacity-0'}
          show={state.style === 'dot'}
        >
          <div className={'mt-5 flex flex-col justify-center px-1'}>
            <p className={'mb-3'}>
              <span className={'text-xs font-semibold uppercase text-black'}>
                {lang==='ar'?'تخصيصات نوع النقطة' :'Dot Type customizations'}
              </span>
            </p>
            <div className={'flex flex-wrap gap-y-3'}>
              <Button
                title={lang==='ar'?'دائري*' :'Rounded*'}
                active={state.dotType === 'rounded'}
                onClick={() =>
                  dispatch({
                    type: 'SET_QR_DOT_TYPE',
                    payload: { dotType: 'rounded' },
                  })
                }
              />
              <Button
                title={lang==='ar'?'أنيق*' :'Classy*'}
                active={state.dotType === 'classy'}
                onClick={() =>
                  dispatch({
                    type: 'SET_QR_DOT_TYPE',
                    payload: { dotType: 'classy' },
                  })
                }
              />
              <Button
                title={lang==='ar'?'مربعات' :'Square'}
                active={state.dotType === 'square'}
                onClick={() =>
                  dispatch({
                    type: 'SET_QR_DOT_TYPE',
                    payload: { dotType: 'square' },
                  })
                }
              />
            </div>
            <p className={'mt-5 text-xs font-light text-black'}>
              {lang==='ar'? '* يمكن لأنواع النقاط "المستديرة" و"الراقية" تغيير قابلية قراءة رمز الاستجابة السريعة (QR).':'* Dot types Rounded and Classy can alter the QR code readability.'}
            </p>
          </div>
        </Transition>
      )}
    </>
  );
};

export default ShapesSwitcher;
