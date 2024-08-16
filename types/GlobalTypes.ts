

export interface SearchProps {
    value: any;
    otherStyle?: string;
    placeholder?: string;
    keyboardType?: string;
  }

export interface FormFieldProps {
    title: string;
    value: any;
    handleChageText: (text: string) => void;
    otherStyle?: string;
    placeholder?: string;
    keyboardType?: string;
  }
  

  export interface EmptyStateProps {
    title: string;
    subtitle: string;
    buttonTitle?: string;
   
  }

  export interface ProfileInfoBoxProps {
    title?: string;
    subtitle?: string;
    containerStyles?: string;
    titleStyles?: string;
   
  }

