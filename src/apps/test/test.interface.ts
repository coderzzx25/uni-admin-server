interface IForm {
  id: string;
  name: string;
}

interface Name {
  id: string;
  type: string;
  title: string;
  value: string;
  raw_value: string;
  required: string;
}

interface Email {
  id: string;
  type: string;
  title: string;
  value: string;
  raw_value: string;
  required: string;
}

interface Message {
  id: string;
  type: string;
  title: string;
  value: string;
  raw_value: string;
  required: string;
}

interface FieldC70cdcb {
  id: string;
  type: string;
  title: string;
  value: string;
  raw_value: string;
  required: string;
}

interface FieldB127923 {
  id: string;
  type: string;
  title: string;
  value: string;
  raw_value: string;
  required: string;
}

interface Field18f8b6d {
  id: string;
  type: string;
  title: string;
  value: string;
  raw_value: string;
  required: string;
}

interface FieldE063889 {
  id: string;
  type: string;
  title: string;
  value: string;
  raw_value: string;
  required: string;
}

interface IFields {
  name: Name;
  email: Email;
  message: Message;
  field_c70cdcb: FieldC70cdcb;
  field_b127923: FieldB127923;
  field_18f8b6d: Field18f8b6d;
  field_e063889: FieldE063889;
}

export interface IInquiryData {
  form: IForm;
  fields: IFields;
}
