import { WechatIcon } from "@/assets/WxchatIcon";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn, copyToClipboard } from "@/lib/utils";
import { CopyIcon } from "lucide-react";
import { Button } from "./ui/button";

interface BuyCardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type PlanProps = {
  count: number;
  price: string;
  discount?: string;
  isPopular?: boolean;
  isNew?: boolean;
};

const plans: PlanProps[] = [
  { count: 10, price: "6", discount: "单次仅需0.6元" },
  { count: 50, price: "28.88", discount: "单次仅需0.58元" },
  { count: 100, price: "49.90", discount: "单次仅需0.5元", isPopular: true },
  { count: 200, price: "88.8", discount: "单次仅需0.44元" },
  { count: 300, price: "100", discount: "单次仅需0.33元" },
  { count: 100, price: "39.99", discount: "单次仅需0.4元", isNew: true },
];

export function BuyCard({ open, onOpenChange }: BuyCardProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">充值 AI 生成次数</DialogTitle>
          <DialogDescription className="text-center pt-2">选择适合您的充值套餐，提升您的创作效率</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 mt-4">
          {plans.map((plan, index) => (
            <PlanCard key={index} {...plan} />
          ))}
        </div>

        <div className="mt-6 flex flex-col items-center gap-2 text-center">
          <div className="flex items-center gap-2 text-primary">
            <WechatIcon className="h-5 w-5" />
            <p className="font-medium">购买请添加微信：RELEASE500</p>
            {/* 复制按钮 */}
            <Button variant="ghost" size="icon" onClick={() => copyToClipboard("RELEASE500")}>
              <CopyIcon className="h-4 w-4" />
            </Button>
          </div>
          {/* <p className="text-sm text-muted-foreground">我们将为您提供专业的服务支持</p> */}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PlanCard({ count, price, discount, isPopular, isNew }: PlanProps) {
  return (
    <Card
      className={cn(
        "relative flex flex-col items-center justify-center p-4 border cursor-pointer hover:border-primary hover:shadow-sm transition-all",
        isPopular && "border-primary"
      )}
    >
      {isPopular && (
        <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
          最受欢迎
        </div>
      )}
      {isNew && (
        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
          新人限时特惠
        </div>
      )}
      <div className="text-xl font-bold">{count} 次</div>
      <div className="text-lg font-medium text-primary mt-1">¥ {price}</div>
      {discount && <div className="text-xs text-muted-foreground mt-1">{discount}</div>}
      {/* {isNew && <div className="text-xs text-green-500 font-medium mt-1">交个朋友</div>} */}
    </Card>
  );
}
