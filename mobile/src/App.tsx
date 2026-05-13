import { useCallback, useEffect, useMemo, useState } from "react";
import {
  IonApp,
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToast,
  IonToolbar,
  setupIonicReact
} from "@ionic/react";
import { Network } from "@capacitor/network";
import { leafOutline } from "ionicons/icons";

import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/flex-utils.css";

import "./App.css";
import "./theme/variables.css";

import { agroconnectApi } from "./api/agroconnectApi";
import type { ProductArea, RequestTicket } from "./types";
import {
  formatTicketPriority,
  formatTicketStatus
} from "./utils/ticketFormatters";

setupIonicReact();

function App() {
  const [tickets, setTickets] = useState<RequestTicket[]>([]);
  const [productAreas, setProductAreas] = useState<ProductArea[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [areaFilter, setAreaFilter] = useState("");
  const [commentByTicketId, setCommentByTicketId] = useState<Record<number, string>>({});
  const [toastMessage, setToastMessage] = useState("");
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  const summary = useMemo(() => {
    return {
      total: tickets.length,
      open: tickets.filter((ticket) => ticket.status === "open").length,
      inProgress: tickets.filter((ticket) => ticket.status === "in_progress").length
    };
  }, [tickets]);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setIsToastOpen(true);
  }, []);

  const loadData = useCallback(async () => {
    try {
      const [areasResponse, ticketsResponse] = await Promise.all([
        agroconnectApi.getProductAreas() as Promise<ProductArea[]>,
        agroconnectApi.getTickets({
          status: statusFilter,
          productAreaId: areaFilter
        }) as Promise<RequestTicket[]>
      ]);

      setProductAreas(areasResponse);
      setTickets(ticketsResponse);
    } catch {
      showToast("Não foi possível carregar as solicitações.");
    }
  }, [areaFilter, showToast, statusFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    async function loadNetworkStatus() {
      const status = await Network.getStatus();
      setIsOnline(status.connected);
    }

    loadNetworkStatus();

    const listener = Network.addListener("networkStatusChange", (status) => {
      setIsOnline(status.connected);
    });

    return () => {
      listener.then((handler) => handler.remove());
    };
  }, []);

  async function handleRefresh(event: CustomEvent) {
    await loadData();
    event.detail.complete();
  }

  async function handleAdvanceStatus(ticket: RequestTicket) {
    try {
      const updatedTicket = await agroconnectApi.advanceTicketStatus(ticket.id);

      setTickets((currentTickets) =>
        currentTickets.map((item) => (item.id === ticket.id ? updatedTicket : item))
      );

      showToast(`Solicitação movida para ${formatTicketStatus(updatedTicket.status)}.`);
    } catch {
      showToast("Não foi possível avançar o status.");
    }
  }

  async function handleAddComment(ticket: RequestTicket) {
    const message = commentByTicketId[ticket.id]?.trim();

    if (!message) return;

    try {
      const updatedTicket = await agroconnectApi.createComment(ticket.id, message);

      setTickets((currentTickets) =>
        currentTickets.map((item) => (item.id === ticket.id ? updatedTicket : item))
      );

      setCommentByTicketId((current) => ({
        ...current,
        [ticket.id]: ""
      }));

      showToast("Comentário adicionado.");
    } catch {
      showToast("Não foi possível adicionar o comentário.");
    }
  }

  return (
    <IonApp>
      <IonPage>
        <IonHeader>
          <IonToolbar className={isOnline ? "mobile-toolbar-online" : "mobile-toolbar-offline"}>
            <IonTitle>
              AgroConnect Mobile {!isOnline ? <span className="offline-label">Offline</span> : null}
            </IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent fullscreen className="ion-padding">
          <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
            <IonRefresherContent />
          </IonRefresher>

          <section className="mobile-hero-card">
            <div>
              <span className="mobile-eyebrow">Ruby on Rails + React + PostgreSQL</span>
              <h1>AgroConnect</h1>
              <p>
                Um portal de solicitações de clientes para o ecossistema Agro:
                gestão, campo, sementes, laboratório, análise de dados e integrações.
              </p>
            </div>

            <div className="mobile-hero-icon" aria-hidden="true">
              <IonIcon icon={leafOutline} />
            </div>
          </section>

          <IonCard className="mobile-summary-card">
            <IonCardHeader>
              <IonCardTitle>Solicitações</IonCardTitle>
              <IonCardSubtitle>
                Acompanhe demandas do ecossistema Agro em formato mobile.
              </IonCardSubtitle>
            </IonCardHeader>

            <IonCardContent>
              <div className="mobile-summary-grid">
                <div className="mobile-summary-item">
                  <strong>{summary.total}</strong>
                  <span>Total</span>
                </div>

                <div className="mobile-summary-item">
                  <strong>{summary.open}</strong>
                  <span>Abertas</span>
                </div>

                <div className="mobile-summary-item">
                  <strong>{summary.inProgress}</strong>
                  <span>Em andamento</span>
                </div>
              </div>
            </IonCardContent>
          </IonCard>

          <IonList>
            <IonItem>
              <IonLabel>Área</IonLabel>
              <IonSelect
                value={areaFilter}
                placeholder="Todas"
                onIonChange={(event) => setAreaFilter(event.detail.value ?? "")}
              >
                <IonSelectOption value="">Todas</IonSelectOption>

                {productAreas.map((area) => (
                  <IonSelectOption key={area.id} value={String(area.id)}>
                    {area.name}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>

            <IonItem>
              <IonLabel>Status</IonLabel>
              <IonSelect
                value={statusFilter}
                placeholder="Todos"
                onIonChange={(event) => setStatusFilter(event.detail.value ?? "")}
              >
                <IonSelectOption value="">Todos</IonSelectOption>
                <IonSelectOption value="open">Aberta</IonSelectOption>
                <IonSelectOption value="in_progress">Em andamento</IonSelectOption>
                <IonSelectOption value="waiting_customer">Aguardando cliente</IonSelectOption>
                <IonSelectOption value="resolved">Resolvida</IonSelectOption>
                <IonSelectOption value="closed">Fechada</IonSelectOption>
              </IonSelect>
            </IonItem>
          </IonList>

          {tickets.length === 0 ? (
            <IonCard>
              <IonCardContent>Nenhuma solicitação encontrada.</IonCardContent>
            </IonCard>
          ) : null}

          {tickets.map((ticket) => (
            <IonCard key={ticket.id}>
              <IonCardHeader>
                <IonCardTitle>{ticket.title}</IonCardTitle>
                <IonCardSubtitle>
                  {ticket.customer.name} • {ticket.product_area.name}
                  {ticket.due_date ? ` • Prazo ${ticket.due_date}` : ""}
                </IonCardSubtitle>
              </IonCardHeader>

              <IonCardContent>
                <p>{ticket.description}</p>

                <div className="ticket-badges">
                  <IonBadge className={`mobile-badge status-${ticket.status}`}>
                    {formatTicketStatus(ticket.status)}
                  </IonBadge>

                  <IonBadge className={`mobile-priority priority-${ticket.priority}`}>
                    {formatTicketPriority(ticket.priority)}
                  </IonBadge>
                </div>

                <div className="mobile-comments-box">
                  <strong>Comentários</strong>

                  {ticket.ticket_comments.length === 0 ? (
                    <small>Nenhum comentário ainda.</small>
                  ) : (
                    ticket.ticket_comments.map((comment) => (
                      <div key={comment.id} className="mobile-comment-item">
                        <span>{comment.author_name}</span>
                        <p>{comment.message}</p>
                      </div>
                    ))
                  )}
                </div>

                <IonTextarea
                  label="Novo comentário"
                  labelPlacement="stacked"
                  placeholder="Adicionar comentário rápido"
                  value={commentByTicketId[ticket.id] ?? ""}
                  onIonInput={(event) =>
                    setCommentByTicketId((current) => ({
                      ...current,
                      [ticket.id]: event.detail.value ?? ""
                    }))
                  }
                />

                <div className="ticket-actions-mobile">
                  <IonButton
                    expand="block"
                    fill="outline"
                    onClick={() => handleAddComment(ticket)}
                    disabled={!commentByTicketId[ticket.id]?.trim()}
                  >
                    Comentar
                  </IonButton>

                  <IonButton
                    expand="block"
                    color="success"
                    onClick={() => handleAdvanceStatus(ticket)}
                    disabled={ticket.status === "closed"}
                  >
                    Avançar status
                  </IonButton>
                </div>
              </IonCardContent>
            </IonCard>
          ))}

          <IonToast
            isOpen={isToastOpen}
            message={toastMessage}
            duration={2500}
            onDidDismiss={() => setIsToastOpen(false)}
          />
        </IonContent>
      </IonPage>
    </IonApp>
  );
}

export default App;