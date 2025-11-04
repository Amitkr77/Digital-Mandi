"use client";

import { ShoppingBag, UserPlus, Truck, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import { FixedSizeList as List } from "react-window";

const generateId = () => `_${Math.random().toString(36).substr(2, 9)}`;

const initialActivities = [
  {
    id: generateId(),
    type: "sale",
    saleId: "#SALE8921",
    amount: "₹8,400",
    time: new Date(Date.now() - 2 * 60 * 1000),
  },
  {
    id: generateId(),
    type: "farmer",
    name: "Anil Sharma",
    time: new Date(Date.now() - 15 * 60 * 1000),
  },
  {
    id: generateId(),
    type: "delivery",
    product: "Wheat 500kg",
    time: new Date(Date.now() - 45 * 60 * 1000),
  },
  {
    id: generateId(),
    type: "sale",
    saleId: "#SALE8920",
    amount: "₹12,300",
    time: new Date(Date.now() - 70 * 60 * 1000),
  },
  {
    id: generateId(),
    type: "farmer",
    name: "Priya Singh",
    time: new Date(Date.now() - 90 * 60 * 1000),
  },
];

const RecentActivity = () => {
  const [activities, setActivities] = useState(initialActivities);

  // Simulate real-time activity every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const types = ["sale", "farmer", "delivery"];
      const newType = types[Math.floor(Math.random() * types.length)];

      const newActivity = {
        id: generateId(),
        type: newType,
        time: new Date(),
        ...(newType === "sale" && {
          saleId: `#SALE${Math.floor(8000 + Math.random() * 2000)}`,
          amount: `₹${(Math.random() * 15000 + 5000).toFixed(0)}`,
        }),
        ...(newType === "farmer" && {
          name: ["Rajesh Kumar", "Sunita Devi", "Vikram Singh", "Meera Patel"][
            Math.floor(Math.random() * 4)
          ],
        }),
        ...(newType === "delivery" && {
          product: [
            "Rice 300kg",
            "Maize 800kg",
            "Pulses 200kg",
            "Sugarcane 1Ton",
          ][Math.floor(Math.random() * 4)],
        }),
      };

      setActivities((prev) => [newActivity, ...prev.slice(0, 49)]);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getIcon = (type) => {
    const iconClass = "h-4 w-4";
    switch (type) {
      case "sale":
        return <ShoppingBag className={`${iconClass} text-green-600`} />;
      case "farmer":
        return <UserPlus className={`${iconClass} text-blue-600`} />;
      case "delivery":
        return <Truck className={`${iconClass} text-purple-600`} />;
      default:
        return null;
    }
  };

  const getBadge = (type) => {
    const base = "text-xs font-medium px-2 py-0.5 rounded-full";
    switch (type) {
      case "sale":
        return (
          <span className={`${base} bg-green-100 text-green-700`}>Sale</span>
        );
      case "farmer":
        return (
          <span className={`${base} bg-blue-100 text-blue-700`}>
            New Farmer
          </span>
        );
      case "delivery":
        return (
          <span className={`${base} bg-purple-100 text-purple-700`}>
            Delivery
          </span>
        );
      default:
        return null;
    }
  };

  const getMessage = (act) => {
    switch (act.type) {
      case "sale":
        return (
          <>
            <strong>{act.saleId}</strong> – {act.amount}
          </>
        );
      case "farmer":
        return (
          <>
            New farmer <strong>{act.name}</strong> registered
          </>
        );
      case "delivery":
        return (
          <>
            <strong>{act.product}</strong> arrived
          </>
        );
      default:
        return null;
    }
  };

  const ActivityRow = ({ index }) => {
    const act = activities[index];

    return (
      <div
        key={act.id}
        className="flex gap-3 text-sm p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-default"
        role="listitem"
        aria-label={`${act.type} activity ${formatDistanceToNow(act.time, {
          addSuffix: true,
        })}`}
      >
        <div className="mt-0.5 shrink-0">{getIcon(act.type)}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-foreground font-medium truncate">
              {getMessage(act)}
            </p>
            {getBadge(act.type)}
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <Clock className="h-3 w-3" />
            {formatDistanceToNow(act.time, { addSuffix: true })}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Recent Activity</h3>
        <span className="text-xs text-muted-foreground">
          {activities.length} events
        </span>
      </div>

      <div className="max-h-80 overflow-hidden border rounded-lg bg-card">
        <div className="max-h-80 overflow-y-auto p-1 space-y-1">
          {activities.map((act, index) => (
            <ActivityRow key={act.id} index={index} style={{}} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
