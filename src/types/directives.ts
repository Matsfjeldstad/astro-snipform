/**
 * Error state directive props.
 * Controls what happens when a field has a validation error.
 */
export interface ErrorStateProps {
  /** The field name to watch for errors */
  field: string;
  /** Show this element when the field has an error */
  show?: boolean;
  /** Hide this element when the field has an error */
  hide?: boolean;
  /** Inject the server error message text into this element */
  showText?: boolean;
  /** Set custom text when the field has an error */
  text?: string;
  /** Add CSS class(es) when the field has an error */
  class?: string;
  /** Add inline style when the field has an error */
  style?: string;
}

/**
 * Valid state directive props.
 * Controls what happens when a field passes validation.
 */
export interface ValidStateProps {
  /** The field name to watch for valid state */
  field: string;
  /** Show this element when the field is valid */
  show?: boolean;
  /** Hide this element when the field is valid */
  hide?: boolean;
  /** Set custom text when the field is valid */
  text?: string;
  /** Add CSS class(es) when the field is valid */
  class?: string;
  /** Add inline style when the field is valid */
  style?: string;
}

/**
 * Input-level state styling props.
 * Applied directly on input/select/textarea elements.
 */
export interface InputStateProps {
  /** CSS class to add when this input has an error */
  errorClass?: string;
  /** Inline style to add when this input has an error */
  errorStyle?: string;
  /** CSS class to add when this input is valid */
  validClass?: string;
  /** Inline style to add when this input is valid */
  validStyle?: string;
}

/**
 * Submit/loading state directive props.
 * Controls element behavior during form submission.
 */
export interface SubmitStateProps {
  /** Show this element during submission */
  onSubmitShow?: boolean;
  /** Hide this element during submission */
  onSubmitHide?: boolean;
  /** Set text during submission */
  onSubmitText?: string;
  /** Add CSS class during submission */
  onSubmitClass?: string;
  /** Add inline style during submission */
  onSubmitStyle?: string;
}
