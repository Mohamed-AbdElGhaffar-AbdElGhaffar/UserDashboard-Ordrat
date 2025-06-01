'use client';

import React from 'react';
import { Step } from 'nextstepjs';
import { dir } from "i18next";

interface CustomCardProps {
  step: Step;
  currentStep: number;
  totalSteps: number;
  nextStep: () => void;
  prevStep: () => void;
  skipTour?: () => void;
  arrow: React.ReactNode;
  lang: string;
}

const CustomCard = ({
  step,
  currentStep,
  totalSteps,
  nextStep,
  prevStep,
  skipTour,
  arrow,
  lang,
}: CustomCardProps) => {
  const isArabic = lang === 'ar';
  const isLastStep = currentStep === totalSteps - 1;
  const isFirstStep = currentStep === 0;

  const labels = {
    next: isArabic ? 'التالي' : 'Next',
    previous: isArabic ? 'السابق' : 'Previous',
    finish: isArabic ? 'إنهاء' : 'Finish',
    skip: isArabic ? 'تخطي الشرح' : 'Skip Explanation',
    of: isArabic ? 'من' : 'of',
  };

  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  return (
    // <div
    //   data-name="nextstep-card"
    //   className={`absolute z-[999] pointer-events-auto flex flex-col max-w-full min-w-min 
    //     ${step.side === 'bottom' ? 'top-full mt-6' : 'bottom-full mb-6'} 
    //     start-1/2 -translate-x-1/2`}
    //   dir={isArabic ? 'rtl' : 'ltr'}
    // >
      <div 
        lang={lang}
        dir={dir(lang)}
        className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 min-w-[16rem] max-w-[32rem]"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">{step.title}</h2>
          <span className="text-xl">{step.icon}</span>
        </div>

        {/* Content */}
        <div className="text-sm mb-4">{step.content}</div>

        {/* Progress Bar */}
        <div className="mb-4 h-2 rounded-full bg-gray-200 overflow-hidden">
          <div
            className="h-2 rounded-full transition-all"
            style={{
              width: `${progressPercentage}%`,
              backgroundColor: isLastStep ? 'rgb(16, 185, 129)' : 'rgb(37, 99, 235)',
            }}
          ></div>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center gap-4 text-xs">
          <button
            disabled={isFirstStep}
            onClick={prevStep}
            className="px-4 py-2 rounded-md font-medium bg-gray-100 text-gray-600 disabled:opacity-50"
          >
            {labels.previous}
          </button>
          <span className="text-gray-500 whitespace-nowrap">
            {`${currentStep + 1} ${labels.of} ${totalSteps}`}
          </span>
          <button
            onClick={nextStep}
            className={`px-4 py-2 rounded-md font-medium text-white ${
              isLastStep ? 'bg-emerald-500' : 'bg-blue-600'
            }`}
          >
            {isLastStep ? labels.finish : labels.next}
          </button>
        </div>

        {/* Arrow */}
        {arrow}

        {/* Skip Tour */}
        {skipTour && step.showSkip && !isLastStep && (
          <button
            onClick={skipTour}
            className="mt-4 text-xs font-medium w-full px-4 py-2 bg-gray-100 text-gray-600 rounded-md"
          >
            {labels.skip}
          </button>
        )}
      </div>
    // </div>
  );
};

export default CustomCard;
