import { useState } from "react";
import type { FormEvent } from "react";
import { Plus } from "lucide-react";
import { cpf, cnpj } from "cpf-cnpj-validator";
import type { CustomerPayload, CustomerType } from "../types";

type CustomerFormProps = {
  value: CustomerPayload;
  onChange: (value: CustomerPayload) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function formatCpfOrCnpj(value: string) {
  const digits = onlyDigits(value);

  if (digits.length <= 11) {
    return cpf.format(digits);
  }

  return cnpj.format(digits.slice(0, 14));
}

function isCpfOrCnpjValid(value: string) {
  const digits = onlyDigits(value);

  if (digits.length === 11) {
    return cpf.isValid(digits);
  }

  if (digits.length === 14) {
    return cnpj.isValid(digits);
  }

  return false;
}

export function CustomerForm({ value, onChange, onSubmit }: CustomerFormProps) {
  const [documentError, setDocumentError] = useState("");

  function handleDocumentChange(rawValue: string) {
    const formattedDocument = formatCpfOrCnpj(rawValue);

    setDocumentError("");

    onChange({
      ...value,
      document: formattedDocument
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (!isCpfOrCnpjValid(value.document)) {
      event.preventDefault();
      setDocumentError("Informe um CPF ou CNPJ válido.");
      return;
    }

    onSubmit(event);
  }

  return (
    <aside className="panel">
      <h2>Novo cliente</h2>
      <p>Cadastre um cliente que poderá abrir solicitações no ecossistema Agro.</p>

      <form onSubmit={handleSubmit} className="form-stack">
        <input
          placeholder="Nome do cliente"
          value={value.name}
          onChange={(event) => onChange({ ...value, name: event.target.value })}
          required
        />

        <div className="field-group">
          <input
            placeholder="CPF/CNPJ"
            value={value.document}
            onChange={(event) => handleDocumentChange(event.target.value)}
            maxLength={18}
            required
            aria-invalid={Boolean(documentError)}
          />

          {documentError ? (
            <small className="field-error">{documentError}</small>
          ) : null}
        </div>

        <select
          value={value.customer_type}
          onChange={(event) =>
            onChange({
              ...value,
              customer_type: event.target.value as CustomerType
            })
          }
        >
          <option value="rural_producer">Produtor rural</option>
          <option value="seed_producer">Produtor de sementes</option>
          <option value="laboratory">Laboratório</option>
          <option value="warehouse">Armazém</option>
          <option value="technical_assistance">Assistência técnica</option>
          <option value="accounting_office">Escritório contábil</option>
        </select>

        <input
          placeholder="Cidade"
          value={value.city}
          onChange={(event) => onChange({ ...value, city: event.target.value })}
          required
        />

        <input
          placeholder="Estado, ex: MG"
          maxLength={2}
          value={value.state}
          onChange={(event) =>
            onChange({ ...value, state: event.target.value.toUpperCase() })
          }
          required
        />

        <button type="submit">
          <Plus size={16} /> Adicionar cliente
        </button>
      </form>
    </aside>
  );
}